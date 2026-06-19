const fs = require('fs');

const commitMsgFile = process.argv[2];
const commitMsg = fs.readFileSync(commitMsgFile, 'utf-8').trim();

// [MOG-숫자] 내용 형식 검사
const pattern = /^\[MOG-\d+\] .+/;

if (!pattern.test(commitMsg)) {
  console.error('\n❌ 커밋 메시지 형식이 올바르지 않습니다.');
  console.error('   형식: [MOG-숫자] 내용');
  console.error('   예시: [MOG-101] 로그인 폼 구현\n');
  process.exit(1);
}
