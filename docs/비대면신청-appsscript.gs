/**
 * 비대면(원격) 연수 신청서 수집용 Google Apps Script
 * ----------------------------------------------------
 * 설정 방법
 * 1) 구글 드라이브에서 새 "구글 스프레드시트" 하나 생성 (예: "비대면 연수 신청")
 * 2) 상단 메뉴 [확장 프로그램] → [Apps Script] 클릭
 * 3) 기본 코드를 지우고 아래 내용을 그대로 붙여넣기 → 저장
 * 4) 오른쪽 위 [배포] → [새 배포] → 유형 "웹 앱" 선택
 *      - 실행 계정: 나
 *      - 액세스 권한: "모든 사용자"  ← 반드시 이걸로!
 *    [배포] 누르고 권한 승인 → 나오는 "웹 앱 URL"(.../exec) 복사
 * 5) 그 URL을 담당자(클로드)에게 전달하면 apply.html에 넣어 배포합니다.
 *
 * 신청 데이터는 이 스프레드시트에 자동으로 쌓입니다.
 * 엑셀로 받으려면: 스프레드시트 [파일] → [다운로드] → [Microsoft Excel(.xlsx)]
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // 동시 신청 시 순서 보장
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('신청') || ss.insertSheet('신청');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['신청시각', '성명', '전화번호', '희망 연수 일시']);
    }
    var p = e.parameter || {};
    sheet.appendRow([
      new Date(),
      p.name || '',
      p.phone || '',
      p.slot || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// 브라우저에서 URL을 그냥 열었을 때 확인용
function doGet() {
  return ContentService.createTextOutput('비대면 연수 신청 접수 서버가 정상 동작 중입니다.');
}
