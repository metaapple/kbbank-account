import axios from 'axios';

/**
 * API 기본 URL 설정 (로컬 JSON 서버)
 * 가계부 데이터를 관리하는 서버 주소입니다.
 */
const API_BASE_URL = 'http://localhost:3000/transactions';

/**
 * Axios를 사용하여 가계부 API의 CRUD 기능을 테스트하는 함수
 * 1. 전체 조회 (GET)
 * 2. 신규 데이터 생성 (POST)
 * 3. 단일 데이터 조회 (GET)
 * 4. 데이터 삭제 (DELETE)
 * 5. 삭제 확인 (GET)
 */
async function testAxios() {
  console.log('--- Starting Axios Tests ---');

  // 1. GET: 전체 트랜잭션 데이터 조회
  console.log('Fetching all transactions...');
  try {
    const response = await axios.get(API_BASE_URL);
    // API로부터 가져온 데이터 중 상위 5개만 로그 출력
    console.log('GET Response (first 5 items):', response.data.slice(0, 5));
    console.log('Total items fetched:', response.data.length);
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
  }

  // 2. POST: 새로운 트랜잭션 데이터 생성
  console.log('Adding a new transaction...');
  const newTransaction = {
    type: 'income',
    title: 'Axios 테스트 수입',
    amount: 150000,
    date: new Date().toISOString().split('T')[0], // 현재 날짜 (YYYY-MM-DD)
  };
  try {
    const response = await axios.post(API_BASE_URL, newTransaction);
    console.log('POST Response (new item):', response.data);
    const addedId = response.data.id; // 생성된 항목의 ID 저장

    // 3. GET: 방금 생성한 항목 상세 조회
    console.log(`\nFetching newly added transaction (id: ${addedId})...`);
    const getResponse = await axios.get(`${API_BASE_URL}/${addedId}`);
    console.log('GET Single Item Response:', getResponse.data);

    // 4. DELETE: 방금 생성한 항목 삭제
    console.log(`\nDeleting transaction (id: ${addedId})...`);
    await axios.delete(`${API_BASE_URL}/${addedId}`);
    console.log(`Transaction with id ${addedId} deleted successfully.`);

    // 5. Verify: 삭제 후 다시 조회하여 404 에러 확인 (삭제 검증)
    console.log(`\nVerifying deletion of transaction (id: ${addedId})...`);
    try {
      await axios.get(`${API_BASE_URL}/${addedId}`);
      console.log('Deletion failed: Item still exists.');
    } catch (error) {
      // 삭제 후 아이템을 찾을 수 없어야 하므로 404 에러 발생 시 성공
      if (error.response && error.response.status === 404) {
        console.log('Deletion verified: Item not found (expected 404).');
      } else {
        console.error('Error verifying deletion:', error.message);
      }
    }
  } catch (error) {
    // 요청 실패 시 에러 처리
    console.error('Error during POST/DELETE operations:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }

  console.log('--- Axios Tests Finished ---');
}

// 테스트 함수 실행
testAxios();
