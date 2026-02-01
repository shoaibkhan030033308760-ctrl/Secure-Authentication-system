const { transporter } = require('../config/mails');
const { generateOtp } = require('../otp/generateotp');
const { expireOtp } = require("../otp/expireOtp")
const sodium = require('libsodium-wrappers-sumo')
const { User } = require('../model/user');
const { Otp } = require("../model/Otp");

const passwordregex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

async function sendOtp(req, reply) {
try {
    const { email, purpose } = req.body;
    if (!email || !purpose) {
      return reply.code(400).send({ message: "Email and purpose required" });
    }
    if (!["register", "forgot"].includes(purpose)) {
      return reply.code(400).send({ message: "Invalid purpose" });
    }
  let user = await User.findOne({ where: { email } });

     if (purpose === "forgot") {
      if (!user) {
        return reply.code(401).send ({message:"user not found"})
      }
       if (!user.isVerified) {
        return reply.code(404).send({ message: "You Are Not Eligibel for this Function" });
      }
    }
   if (purpose === "register") {
      if (!user) {
     user = await User.create({
          email,
          isVerified: false,
        });
      }
    }

    // if (user.isVerified) {
    //   return reply.code(429).send({ message: "user already register" })
    // }
  
    const lastOtp = await Otp.findOne({
      where: {
        userId: user.id,
        purpose
      },
      order: [["createdAt", "DESC"]],
    });
    if (lastOtp) {
      const diffSeconds =
        (Date.now() - new Date(lastOtp.createdAt).getTime()) / 1000;

      if (diffSeconds < 30) {
        return reply.code(429).send({
          message: `Wait ${Math.ceil(30 - diffSeconds)} seconds`,
        });
      }
    }
    
    const otp = generateOtp();
    const expireAt = new Date(Date.now() + 5 * 60 * 1000);
    await Otp.create({
      Otpcode: otp,
      expireAt,
      purpose,
      userId: user.id
    });

    await transporter.sendMail({
      to: email,
      subject:
        purpose === "register"
          ? "Your registration OTP"
          : "Your password reset OTP",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    return reply.code(200).send({ message: "OTP sent successfully" });

  } catch (err) {
    console.error(err);
    return reply.code(500).send({ message: "Internal server error" });
  }
}
async function register(req, reply) {
  try {
    await sodium.ready;
    const { name, email, password, otp, twoFactorEnabled } = req.body;
    if (!name || !email || !password || !otp || !twoFactorEnabled) {
      return reply.code(400).send({ message: 'name,email,password,otp and twoFactorEnabled: "enable" or "disable" require' });
    }
    const user = await User.findOne({ where: { email } })
if (!user) {
      return reply.code(400).send({ message: 'otp not requested' })
    }
    if(user.isVerified) {
      return reply.code(400).send ({message: "already register"})
    }
    if (!passwordregex.test(password)) {
      return reply.code(400).send({ message: "minimum 8 char and 1 special char" })
    }

    let tfEnabled;
    if (typeof twoFactorEnabled === "boolean") {
      tfEnabled = twoFactorEnabled;
    } else if (twoFactorEnabled === "enable") {
      tfEnabled = true;
    } else if (twoFactorEnabled === "disable") {
      tfEnabled = false;
    } else {
      return reply.code(400).send({ error: "Invalid twoFactorEnabled value are enable and disable" });
    }

    const hash = await sodium.crypto_pwhash_str(
      password,
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE
    )
    const dbotp = await Otp.findOne({
      where:
        { Otpcode: otp, purpose: "register", userId: user.id }
    })
    if (!dbotp || dbotp.expireAt < new Date()) {
      return reply.code(400).send({ message: "invalid or expired otp" })
    }

    await User.update({
      name,
      password: hash,
      twoFactorEnabled: tfEnabled,
      isLocked: false,
      failedLoginAttempts: 0,
      isVerified: true,
    },
      {
        where: {id: user.id}
      }
    )

    dbotp.destroy()

    return reply.code(201).send({ message: "Registration successful", userId: user.id });
  }
  catch (err) {
    return reply.code(500).send({ message: err.message })
  }
}

async function login(req, reply) {
  try {
    await sodium.ready;
    const { email, password } = req.body;
    if (!email || !password) {
      return reply.code(501).send({ message: "email , password require" })
    }
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return reply.code(404).send({ message: "user not find" })
    }
    const valid = await sodium.crypto_pwhash_str_verify(user.password, password)
    if (!valid) {
      user.failedLoginAttempts += 1;
      let attempts = 4 - user.failedLoginAttempts

      if (user.failedLoginAttempts >= 4) {
        user.isLocked = true;
        await user.save()
        return reply.code(401).send({ message: "your account is is Locked reset you password" })
      }

      await user.save()
      return reply.code(404).send({ message: `password is wrong ${attempts} attempts left` });

    }
    user.failedLoginAttempts = 0;
    await user.save();

    if (user.twoFactorEnabled) {
      const otps = generateOtp()
      const expire = new Date(Date.now() + 1000 * 300)


    const lastOtp = await Otp.findOne({
      where: {
        userId: user.id,
        purpose
      },
      order: [["createdAt", "DESC"]],
    });
    if (lastOtp) {
      const diffSeconds =
        (Date.now() - new Date(lastOtp.createdAt).getTime()) / 1000;

      if (diffSeconds < 30) {
        return reply.code(429).send({
          message: `Wait ${Math.ceil(30 - diffSeconds)} seconds`,
        });
      }
    }

      await Otp.create({
        Otpcode: otps,
        expireAt: expire,
        purpose: "login",
        userId: user.id
      })


      transporter.sendMail({
        to: email,
        subject: "your login code",
        text: `your login otp code is: ${otps}`
      })

      return reply.code(200).send({ message: 'otp send to your email' });
    }

    const token = await sodium.to_hex(sodium.randombytes_buf(64));
    const expireT = new Date(Date.now() + 36000 * 1000)

    user.token = token;
    user.expireToken = expireT;
    await user.save()
    return reply.code(200).send({ token: user.token })
  }
  catch (err) {
    return reply.code(501).send({ message: err.message })
  }
}

async function verifyLoginOtp(req, reply) {
  const { email, otp } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return reply.code(400).send({ message: "Invalid credentials" });

  const dbOtp = await Otp.findOne({
    where: { purpose: "login", Otpcode: otp, userId: user.id },
  });

  if (!dbOtp) {
    return reply.code(400).send({ message: "Invalid" });
  }
  if (dbOtp.expireAt < new Date()) {
    return reply.code(400).send({ messge: "expired" })
  }
  const token =  await sodium.to_hex(sodium.randombytes_buf(64));
  const expire = new Date(Date.now() + 10 * 60 * 1000);

  user.token = token;
  user.expireToken = expire;
  await user.save()

  await dbOtp.destroy()


  return reply.code(200).send({ message: "Login successful", token });
}

async function resetPassword(req, reply) {
  try {
    await sodium.ready;

    const { email, newPassword, otp, twoFactorEnabled } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }

    const otpRecord = await Otp.findOne({
      where: { Otpcode: otp, purpose:"forgot", userId: user.id }
    });

    if (!otpRecord) {
      return reply.code(400).send({ message: "OTP not valid" });
    }
    if (otpRecord.expireAt < new Date()) {
      return reply.code(400).send({ message: "OTP expired" });
    }


    if (!passwordregex.test(newPassword)) {
      return reply.code(401).send({
        message: "Minimum 8 characters and 1 special character required"
      });
    }

    let tfEnabled;
    if (typeof twoFactorEnabled === "boolean") {
      tfEnabled = twoFactorEnabled;
    } else if (twoFactorEnabled === "enable") {
      tfEnabled = true;
    } else if (twoFactorEnabled === "disable") {
      tfEnabled = false;
    } else {
      return reply.code(400).send({ error: "Invalid twoFactorEnabled value  Enable and Disable" });
    }


    const hash = await sodium.crypto_pwhash_str(
      newPassword,
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE
    );

    await user.update({
      password: hash,
      failedLoginAttempts: 0,
      isLocked: false,
      twoFactorEnabled: tfEnabled,
    },
  {
    where:{id: user.id}
  })
    await user.save();

    otpRecord.destroy()

    return reply.code(200).send({ message: `Password reset successful and And 2FA is ${tfEnabled}` });
  } catch (err) {
    return reply.code(501).send({ message: err.message });
  }
}
module.exports = { sendOtp, register, login, resetPassword, verifyLoginOtp };
