function calculatePRDeadline(prCreatedAtKST) {
  const prCreatedAt = new Date(String(prCreatedAtKST));

  const prCreatedMinute = prCreatedAt.getUTCMinutes();
  const prCreatedHour = prCreatedAt.getUTCHours();
  const prCreatedDate = prCreatedAt.getUTCDate();
  const prCreatedDay = prCreatedAt.getUTCDay();
  const prCreatedMonth = prCreatedAt.getUTCMonth() + 1; // getUTCMonth()는 0부터 시작하므로 1을 더해줍니다.

  const isFridayAfternoon = prCreatedDay === 5 && prCreatedHour >= 22; // 금요일 오후 10시 이후 (금요일: 5, 오후 12시: 12)
  const isWeekend = prCreatedDay === 6 || prCreatedDay === 0; // 주말인 경우
  const isMondayMorning = prCreatedDay === 1 && prCreatedHour < 10; // 월요일 오전 10시 이전 (월요일: 1, 오전 10시: 10)

  // 주어진 근무시간(월요일 오전 10시~금요일 오후 10시) 내에 올린 pr인지 판별
  const isNotWorkingTime = isFridayAfternoon || isWeekend || isMondayMorning;

  let nextDay = new Date(prCreatedAt);
  nextDay.setUTCDate(prCreatedDate + 1); // 다음 날의 날짜를 설정합니다.

  const nextDayDate = nextDay.getUTCDate();
  const nextDayMonth = nextDay.getUTCMonth() + 1;

  let nextWeekMonday = new Date(prCreatedAt);
  const daysUntilMonday = 8 - prCreatedDay;
  nextWeekMonday.setUTCDate(
    prCreatedDay === 0 ? prCreatedDate + 1 : prCreatedDate + daysUntilMonday,
  );
  const nextWeekMondayDate = nextWeekMonday.getUTCDate();
  const nextWeekMondayMonth = nextWeekMonday.getUTCMonth() + 1;

  const isFriday = prCreatedDay === 5;

  console.log('calculatePRDeadline return test 5');

  if (isNotWorkingTime)
    return `${nextWeekMondayMonth}월 ${nextWeekMondayDate}일 20시 00분`;

  if (prCreatedHour < 10 && prCreatedHour > 0)
    return `${prCreatedMonth}월 ${prCreatedDate}일 20시 00분`;
  else if (prCreatedHour === 22 || prCreatedHour === 23)
    return `${nextDayMonth}월 ${nextDayDate}일 20시 00분`;
  else if (prCreatedHour >= 12)
    return `${isFriday ? nextWeekMondayMonth : nextDayMonth}월 ${
      isFriday ? nextWeekMondayDate : nextDayDate
    }일 ${prCreatedHour - 2}시 ${prCreatedMinute}분`;
  else
    return `${isFriday ? nextWeekMondayMonth : prCreatedMonth}월 ${
      isFriday ? nextWeekMondayDate : prCreatedDate
    }일 ${prCreatedHour + 10}시 ${prCreatedMinute}분`;
}

console.log(
  `::set-output name=DEADLINE::${calculatePRDeadline(
    process.env.PR_CREATED_AT_KST,
  )}`,
); // yml 파일에서 github env로 생성한 환경변수
