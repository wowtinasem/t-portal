# 2026 AI디지털교육 역량강화 연수 포털

교원을 위한 AI·디지털교육 연수 운영 포털 (정적 사이트).

## 배포

- 🌐 **라이브 사이트**: https://t-portalapp.netlify.app
- 호스팅: Netlify (GitHub 연동 자동 배포)

## 구성

| 파일 | 설명 |
| --- | --- |
| `index.html` | 배포용 진입 파일 (Netlify가 루트에서 서빙) |
| `t-portal.html` | 원본 초안 (작업 사본) |

`index.html`은 `t-portal.html`의 복사본입니다. 내용을 수정할 때는 `index.html`을 기준으로 작업하세요.

## 로컬에서 보기

별도 빌드 과정 없이 브라우저로 `index.html`을 열면 됩니다.

```bash
# 또는 간단한 로컬 서버
python -m http.server 8000
# http://localhost:8000
```

## 남은 작업 (TODO)

- [ ] 더미 링크(`#`)를 실제 다운로드 / Google Drive / 설문 URL로 연결
- [ ] 기관 정보(`○○교육청`, 주소, 전화, 이메일) 실데이터 반영
- [ ] 장소 안내 지도를 실제 지도 임베드/이미지로 교체
- [ ] 운영 사진 갤러리를 실제 사진으로 교체
