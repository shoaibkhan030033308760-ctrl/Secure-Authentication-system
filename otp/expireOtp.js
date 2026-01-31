async function expireOtp() {
return new Date(Date.now() + 1000 * 300)
}

module.exports = { expireOtp }