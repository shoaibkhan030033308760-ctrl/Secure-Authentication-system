async function expireOtp() {
    const expire =  new Date(Date.now() + 1000 * 300)
return expire
}

module.exports = { expireOtp }