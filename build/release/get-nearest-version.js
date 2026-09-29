function getNearestVersion (dates, target) {
  if (!target) target = Date.now()

  else if (target instanceof Date) target = target.getTime()

  let nearest = Infinity
  let winner = -1

  for (const key in dates) {
    let date = new Date(dates[key])

    if (date instanceof Date) {
      date = date.getTime()
    }

    const distance = Math.abs(date - target)

    if (distance < nearest) {
      nearest = distance
      winner = key
    }
  }

  return winner
}

export default getNearestVersion
