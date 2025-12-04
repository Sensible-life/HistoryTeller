"""
고급 혈연관계 분석 모듈
- 네트워크 분석
- 시계열 분석
- 통계적 검정
"""

import pandas as pd
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
import seaborn as sns
from kinship_analysis import KwagwaDataParser, KinshipAnalyzer

plt.rcParams['font.family'] = 'AppleGothic'
plt.rcParams['axes.unicode_minus'] = False


class AdvancedKinshipAnalyzer(KinshipAnalyzer):
    """고급 혈연관계 분석 클래스"""
    
    def __init__(self, data_dict):
        super().__init__(data_dict)
    
    def analyze_name_patterns(self):
        """항렬(行列) 분석 - 이름 패턴으로 동일 가문 추정"""
        print("\n[고급 분석 1] 이름 패턴 분석")
        print("-" * 60)
        
        df = self.combined_df.copy()
        
        # 성관별로 그룹화
        grouped = df.groupby('성관')
        
        name_patterns = []
        
        for name, group in grouped:
            if len(group) >= 5:  # 최소 5명 이상인 성관만
                # 이름의 두 번째 글자 (항렬자) 분석
                names = group['급제자'].str.split('', expand=True)
                if len(names.columns) >= 3:
                    second_chars = names[2].value_counts()
                    
                    # 가장 많이 사용된 항렬자
                    if len(second_chars) > 0:
                        top_char = second_chars.index[0]
                        top_count = second_chars.iloc[0]
                        
                        if top_count >= 3:  # 최소 3명 이상 같은 항렬자
                            name_patterns.append({
                                '성관': name,
                                '총급제자수': len(group),
                                '주요항렬자': top_char,
                                '항렬자사용횟수': top_count,
                                '항렬자비율': f"{(top_count/len(group)*100):.1f}%"
                            })
        
        pattern_df = pd.DataFrame(name_patterns)
        if not pattern_df.empty:
            pattern_df = pattern_df.sort_values('항렬자사용횟수', ascending=False)
            print(f"\n항렬자 패턴이 명확한 성관: {len(pattern_df)}개")
            print(pattern_df.head(15).to_string(index=False))
        
        return pattern_df
    
    def analyze_exam_success_rate_by_period(self):
        """시대별 특정 성관의 급제율 변화 추적"""
        print("\n[고급 분석 2] 주요 성관의 시대별 급제 패턴")
        print("-" * 60)
        
        df = self.combined_df.copy()
        
        # 상위 5개 성관 선정
        top_families = df['성관'].value_counts().head(5).index.tolist()
        
        # 시대별로 분류
        def get_period(year):
            if pd.isna(year):
                return None
            if year < 1494:
                return '조선 전기'
            elif year < 1608:
                return '조선 중기'
            else:
                return '조선 후기'
        
        df['시대'] = df['시험년_int'].apply(get_period)
        
        # 각 가문별 시대별 통계
        results = []
        for family in top_families:
            family_data = df[df['성관'] == family]
            
            for period in ['조선 전기', '조선 중기', '조선 후기']:
                period_data = family_data[family_data['시대'] == period]
                total_period = df[df['시대'] == period]
                
                if len(total_period) > 0:
                    count = len(period_data)
                    ratio = (count / len(total_period)) * 100
                    
                    results.append({
                        '성관': family,
                        '시대': period,
                        '급제자수': count,
                        '전체대비비율': f"{ratio:.2f}%"
                    })
        
        result_df = pd.DataFrame(results)
        
        # 피봇 테이블로 변환
        pivot = result_df.pivot(index='성관', columns='시대', values='급제자수')
        print("\n주요 성관의 시대별 급제자 수:")
        print(pivot)
        
        return result_df
    
    def analyze_geographic_concentration(self):
        """지역별 성관 집중도 분석"""
        print("\n[고급 분석 3] 지역-성관 집중도 분석")
        print("-" * 60)
        
        df = self.combined_df[self.combined_df['거주지'] != ''].copy()
        
        # 주요 지역 선정 (상위 10개)
        top_regions = df['거주지'].value_counts().head(10).index.tolist()
        
        region_family_map = []
        
        for region in top_regions:
            region_data = df[df['거주지'] == region]
            top_families = region_data['성관'].value_counts().head(3)
            
            for family, count in top_families.items():
                ratio = (count / len(region_data)) * 100
                region_family_map.append({
                    '지역': region,
                    '성관': family,
                    '급제자수': count,
                    '지역내비율': f"{ratio:.1f}%"
                })
        
        map_df = pd.DataFrame(region_family_map)
        print("\n지역별 주요 성관 (상위 3개):")
        
        for region in top_regions:
            print(f"\n{region}:")
            region_data = map_df[map_df['지역'] == region]
            for _, row in region_data.iterrows():
                print(f"  {row['성관']}: {row['급제자수']}명 ({row['지역내비율']})")
        
        return map_df
    
    def statistical_test_concentration(self):
        """통계적 검정: 급제자 분포가 균등한가?"""
        print("\n[고급 분석 4] 통계적 검정 - 급제자 분포 균등성")
        print("-" * 60)
        
        # 성관별 급제자 수
        family_counts = self.combined_df['성관'].value_counts()
        
        # 균등 분포 가정 (모든 성관이 동일한 급제자 수)
        expected_mean = len(self.combined_df) / len(family_counts)
        
        # 실제 분포의 표준편차
        actual_std = family_counts.std()
        actual_mean = family_counts.mean()
        
        print(f"\n기술 통계:")
        print(f"  평균 급제자/성관: {actual_mean:.2f}명")
        print(f"  표준편차: {actual_std:.2f}")
        print(f"  최대값: {family_counts.max()}명 ({family_counts.index[0]})")
        print(f"  최소값: {family_counts.min()}명")
        print(f"  변이계수(CV): {(actual_std/actual_mean):.2f}")
        
        # 상위 10% 집중도
        n_top = int(len(family_counts) * 0.1)
        top_concentration = family_counts.head(n_top).sum() / family_counts.sum() * 100
        
        print(f"\n집중도 분석:")
        print(f"  상위 10% 성관({n_top}개)의 급제자 비율: {top_concentration:.2f}%")
        
        # 지니계수 계산 (불평등도 측정)
        gini = self._calculate_gini(family_counts.values)
        print(f"\n지니계수: {gini:.4f}")
        print(f"  (0: 완전 평등, 1: 완전 불평등)")
        
        if gini > 0.5:
            print(f"  → 높은 불평등: 특정 성관에 급제 기회 집중")
        elif gini > 0.3:
            print(f"  → 중간 불평등: 일부 성관의 우위")
        else:
            print(f"  → 낮은 불평등: 비교적 균등한 분포")
        
        # 통계적 해석
        print(f"\n해석:")
        if gini > 0.5:
            print(f"  과거제는 형식적으로는 능력주의였으나,")
            print(f"  실질적으로는 특정 명문 가문에 급제 기회가 집중됨")
        
        return {
            'mean': actual_mean,
            'std': actual_std,
            'cv': actual_std / actual_mean,
            'top_concentration': top_concentration,
            'gini': gini
        }
    
    def _calculate_gini(self, values):
        """지니계수 계산"""
        sorted_values = np.sort(values)
        n = len(values)
        cumsum = np.cumsum(sorted_values)
        return (2 * np.sum((np.arange(1, n+1)) * sorted_values)) / (n * cumsum[-1]) - (n + 1) / n
    
    def analyze_exam_grade_distribution(self):
        """등급별(갑과/을과/병과) 성관 분포"""
        print("\n[고급 분석 5] 등급별 성관 분포 분석")
        print("-" * 60)
        
        df = self.combined_df[self.combined_df['등급'] != ''].copy()
        
        # 등급별 통계
        grade_stats = df.groupby('등급').agg({
            '급제자': 'count',
            '성관': 'nunique'
        }).rename(columns={'급제자': '급제자수', '성관': '성관수'})
        
        print("\n등급별 통계:")
        print(grade_stats)
        
        # 주요 성관의 등급 분포
        top_families = df['성관'].value_counts().head(5).index
        
        print("\n주요 성관의 등급별 분포:")
        for family in top_families:
            family_data = df[df['성관'] == family]
            grade_dist = family_data['등급'].value_counts()
            
            print(f"\n{family} (총 {len(family_data)}명):")
            for grade, count in grade_dist.items():
                ratio = (count / len(family_data)) * 100
                print(f"  {grade}: {count}명 ({ratio:.1f}%)")
        
        return grade_stats
    
    def create_timeline_visualization(self):
        """시간대별 급제자 추이 시각화"""
        print("\n[고급 분석 6] 시간대별 급제 추이 시각화")
        print("-" * 60)
        
        df = self.combined_df.copy()
        df = df[df['시험년_int'].notna()]
        
        # 10년 단위로 그룹화
        df['decade'] = (df['시험년_int'] // 10) * 10
        
        # 상위 5개 성관
        top_families = df['성관'].value_counts().head(5).index
        
        fig, ax = plt.subplots(figsize=(16, 8))
        
        for family in top_families:
            family_data = df[df['성관'] == family]
            timeline = family_data.groupby('decade').size()
            ax.plot(timeline.index, timeline.values, marker='o', label=family, linewidth=2)
        
        ax.set_xlabel('연도', fontsize=14)
        ax.set_ylabel('급제자 수 (10년 단위)', fontsize=14)
        ax.set_title('주요 성관의 시대별 급제 추이', fontsize=16, fontweight='bold')
        ax.legend(fontsize=12)
        ax.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('timeline_analysis.png', dpi=300, bbox_inches='tight')
        print("시각화 저장: timeline_analysis.png")
        
        return fig
    
    def generate_advanced_report(self):
        """종합 고급 분석 보고서"""
        print("\n" + "=" * 60)
        print("고급 혈연관계 분석 보고서")
        print("=" * 60)
        
        # 각 분석 실행
        patterns = self.analyze_name_patterns()
        period_trend = self.analyze_exam_success_rate_by_period()
        geo = self.analyze_geographic_concentration()
        stats_test = self.statistical_test_concentration()
        grade = self.analyze_exam_grade_distribution()
        timeline_fig = self.create_timeline_visualization()
        
        print("\n" + "=" * 60)
        print("고급 분석 완료")
        print("=" * 60)
        
        # 결과 저장
        if not patterns.empty:
            patterns.to_csv('항렬자_분석.csv', encoding='utf-8-sig', index=False)
            print("  → 항렬자_분석.csv 저장")
        
        period_trend.to_csv('시대별_성관추이.csv', encoding='utf-8-sig', index=False)
        print("  → 시대별_성관추이.csv 저장")
        
        geo.to_csv('지역별_성관분포.csv', encoding='utf-8-sig', index=False)
        print("  → 지역별_성관분포.csv 저장")
        
        return {
            'patterns': patterns,
            'period_trend': period_trend,
            'geo': geo,
            'stats': stats_test,
            'grade': grade
        }


def main():
    """메인 실행"""
    print("조선시대 과거제 급제자 고급 혈연관계 분석")
    print("=" * 60)
    
    # 데이터 로딩
    parser = KwagwaDataParser(".")
    data = parser.load_all_data()
    
    # 기본 분석
    basic_analyzer = KinshipAnalyzer(data)
    basic_results = basic_analyzer.generate_summary_report()
    basic_analyzer.visualize_results(basic_results)
    
    # 고급 분석
    advanced_analyzer = AdvancedKinshipAnalyzer(data)
    advanced_results = advanced_analyzer.generate_advanced_report()
    
    print("\n" + "=" * 60)
    print("전체 분석 완료!")
    print("=" * 60)
    print("\n생성된 파일:")
    print("  1. kinship_analysis_results.png - 기본 분석 시각화")
    print("  2. timeline_analysis.png - 시대별 추이")
    print("  3. 본관별_급제자수.csv")
    print("  4. 세과가문_분석.csv")
    print("  5. 시대별_통계.csv")
    print("  6. 항렬자_분석.csv")
    print("  7. 시대별_성관추이.csv")
    print("  8. 지역별_성관분포.csv")


if __name__ == "__main__":
    main()
