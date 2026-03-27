const cooldown = new Map();

function checkCooldown(userId) {
  const now = Date.now();

  if (cooldown.has(userId) && now < cooldown.get(userId)) {
    return false;
  }

  cooldown.set(userId, now + 10000);
  return true;
}

module.exports = { checkCooldown };