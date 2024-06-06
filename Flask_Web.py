from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer

app = Flask(__name__)
CORS(app)

# 엑셀 파일에서 데이터를 로드하는 함수
def load_data_from_excel(file_path):
    df = pd.read_excel(file_path, usecols=['선호도1', '선호도2', '선호도3', '링크'])
    df = df.fillna('')
    return df

# 엑셀 파일에서 데이터 로드
df = load_data_from_excel('Study_find.xlsx')

# CountVectorizer 인스턴스 생성
vectorizer = CountVectorizer()

# 사용자 맞춤 스터디 그룹을 반환하는 API 엔드포인트
@app.route('/api/custom-study-groups', methods=['GET'])
def get_custom_study_groups():
    # 요청에서 선호도를 가져옴
    user_preferences = request.args.get('preferences').split()
    selected_groups = []

    # 각 선호도 열에 대해 벡터화 수행
    for column in ['선호도1', '선호도2', '선호도3']:
        study_vectors = vectorizer.fit_transform(df[column].tolist()).toarray()
        
        # 사용자의 각 선호도에 대해 유사도 계산
        for preference in user_preferences:
            user_vector = vectorizer.transform([preference]).toarray()
            similarity_matrix = cosine_similarity(user_vector, study_vectors)
            similar_indices = similarity_matrix[0].argsort()[::-1][:5]  # 상위 5개 결과

            # 유효한 인덱스만 사용하여 링크 추가
            for idx in similar_indices:
                if idx < len(df) and df.iloc[idx]['링크'] not in selected_groups:
                    selected_groups.append(df.iloc[idx]['링크'])

    # 결과 반환
    return jsonify({"groups": selected_groups})

# 애플리케이션 실행
if __name__ == '__main__':
    app.run(debug=True)
