// 챗봇 하이브리드 폴백 함수 (Google Gemini)
// 사이트의 키워드 매칭(무료·즉시)이 실패했을 때만 브라우저가 이 함수를 호출한다.
// 비밀 API 키는 Netlify 환경변수(GEMINI_API_KEY)에서만 읽는다.
// 저장소가 public이므로 키를 코드/HTML에 절대 넣지 않는다.

var MODEL = 'gemini-2.5-flash';

function json(status, obj){
  return {
    statusCode: status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(obj)
  };
}

exports.handler = async function(event){
  if(event.httpMethod !== 'POST'){
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  var key = process.env.GEMINI_API_KEY;
  if(!key){
    // 환경변수 미설정 시에도 사이트가 깨지지 않도록 안내로 대체
    return json(200, { answer: '지금은 답변 도우미가 준비 중이에요. 콜센터 070-8676-3276으로 문의해 주세요.' });
  }

  var question = '';
  try { question = String((JSON.parse(event.body || '{}').question) || '').slice(0, 500); } catch(e){}
  if(!question.trim()){
    return json(200, { answer: '질문을 입력해 주세요. 😊' });
  }

  // 지식 자료(knowledge.md) 로드 — 배포된 사이트에서 그대로 가져오므로 항상 최신
  var kb = '';
  try {
    var base = process.env.URL || process.env.DEPLOY_PRIME_URL || '';
    var kr = await fetch(base + '/data/knowledge.md');
    if(kr.ok) kb = await kr.text();
  } catch(e){}

  var system = [
    '당신은 "2026 AI 디지털 교육 역량강화 연수" 운영포털의 안내 도우미입니다.',
    '아래 [지식자료]에 있는 내용만 근거로 한국어로 친절하고 간결하게(2~4문장) 답하세요.',
    '자료에 없는 내용은 추측하지 말고 "자세한 내용은 콜센터 070-8676-3276으로 문의해 주세요"라고 안내하세요.',
    '링크(URL)는 지식자료에 있는 것만 사용하고, 없는 링크는 절대 만들어내지 마세요.',
    '표가 필요하면 마크다운 표로, 강조는 **굵게**로 표현할 수 있습니다.',
    '',
    '[지식자료]',
    kb || '(자료를 불러오지 못했습니다)'
  ].join('\n');

  try {
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/'
      + MODEL + ':generateContent?key=' + encodeURIComponent(key);
    var resp = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: question }] }],
        generationConfig: {
          maxOutputTokens: 640,
          temperature: 0.4,
          thinkingConfig: { thinkingBudget: 0 }  // 단순 안내용 — 추론 토큰 비활성화(빠르고 저렴)
        }
      })
    });
    if(!resp.ok){
      return json(200, { answer: '죄송해요, 지금은 답변을 준비하기 어려워요. 콜센터 070-8676-3276으로 문의해 주세요.' });
    }
    var data = await resp.json();
    var parts = (((data.candidates || [])[0] || {}).content || {}).parts || [];
    var text = parts.map(function(p){ return p.text || ''; }).join('').trim();
    return json(200, { answer: text || '자세한 내용은 콜센터 070-8676-3276으로 문의해 주세요.' });
  } catch(e){
    return json(200, { answer: '죄송해요, 지금은 답변을 준비하기 어려워요. 콜센터 070-8676-3276으로 문의해 주세요.' });
  }
};
