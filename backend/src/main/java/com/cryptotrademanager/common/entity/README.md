# Common Entity Package

모든 엔티티가 상속받는 기본 엔티티와 공통 속성을 정의하는 패키지입니다.

## 주요 Entity 클래스

- **BaseEntity**: 모든 엔티티의 기본 클래스 (생성일, 수정일, 생성자, 수정자)
- **BaseTimeEntity**: 시간 정보만 포함하는 기본 엔티티
- **BaseUserEntity**: 사용자 정보가 포함된 기본 엔티티
- **SoftDeleteEntity**: 논리 삭제를 지원하는 엔티티

## 공통 속성

- **createdAt**: 생성 일시
- **updatedAt**: 수정 일시
- **createdBy**: 생성자 ID
- **updatedBy**: 수정자 ID
- **deleted**: 삭제 여부 (논리 삭제)