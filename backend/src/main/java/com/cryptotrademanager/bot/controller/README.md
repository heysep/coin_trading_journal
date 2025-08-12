# Bot Controller Package

자동매매 봇 관리 관련 REST API 엔드포인트를 제공하는 컨트롤러들을 담당하는 패키지입니다.

## 주요 컨트롤러 클래스

### BotController
- **GET** `/api/bots`: 사용자 봇 목록 조회
- **POST** `/api/bots`: 새 봇 생성
- **GET** `/api/bots/{id}`: 특정 봇 상세 조회
- **PUT** `/api/bots/{id}`: 봇 설정 수정
- **DELETE** `/api/bots/{id}`: 봇 삭제
- **POST** `/api/bots/{id}/start`: 봇 시작
- **POST** `/api/bots/{id}/stop`: 봇 정지

### BotStatusController
- **GET** `/api/bots/{id}/status`: 봇 상태 조회
- **GET** `/api/bots/{id}/performance`: 봇 성과 조회
- **GET** `/api/bots/{id}/logs`: 봇 실행 로그
- **GET** `/api/bots/active`: 활성 봇 목록
- **POST** `/api/bots/{id}/emergency-stop`: 봇 비상 정지

### BotTemplateController
- **GET** `/api/bot-templates`: 봇 템플릿 목록
- **GET** `/api/bot-templates/{id}`: 템플릿 상세 정보
- **POST** `/api/bot-templates/{id}/create-bot`: 템플릿으로 봇 생성
- **GET** `/api/bot-templates/categories`: 템플릿 카테고리