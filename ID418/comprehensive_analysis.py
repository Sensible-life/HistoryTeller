"""
혈연관계와 과거 급제율의 관계 종합 분석
4가지 분석 방안:
1. 가문별 집중도 분석 (파레토, 로렌츠 곡선, 지니계수)
2. 세대 연속성 분석 (세과, 음서 배경)
3. 시기별 혈연 영향력 변화 (시계열 분석)
4. 혼인 관계망 분석 (네트워크 분석)
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from collections import defaultdict, Counter
import warnings
warnings.filterwarnings('ignore')

# 한글 폰트 설정
plt.rcParams['font.family'] = 'AppleGothic'
plt.rcParams['axes.unicode_minus'] = False
sns.set_style("whitegrid")

from kinship_analysis import KwagwaDataParser, KinshipAnalyzer


class ComprehensiveKinshipAnalyzer(KinshipAnalyzer):
    """종합 혈연관계 분석 클래스"""
    
    def __init__(self, data_dict):
        super().__init__(data_dict)
        self.analysis_results = {}
    
    # =========================================================================
    # 분석 1: 가문별 집중도 분석 (파레토, 로렌츠, 지니계수)
    # =========================================================================
    
    def analyze_concentration_pareto(self):
        """파레토 분석: 상위 N% 가문의 급제자 집중도"""
        print("\n" + "="*70)
        print("📊 분석 1: 가문별 급제자 집중도 분석")
        print("="*70)
        
        family_counts = self.combined_df['성관'].value_counts()
        total_families = len(family_counts)
        total_gwageo = len(self.combined_df)
        
        # 누적 비율 계산
        cumsum = family_counts.cumsum()
        cum_percent = (cumsum / total_gwageo * 100).values
        family_percent = np.arange(1, len(family_counts) + 1) / total_families * 100
        
        # 파레토 분석
        pareto_points = [10, 20, 30, 40, 50]
        print("\n[파레토 분석 결과]")
        print("-" * 70)
        
        pareto_results = []
        for p in pareto_points:
            n_families = int(total_families * p / 100)
            top_n = family_counts.head(n_families)
            concentration = (top_n.sum() / total_gwageo) * 100
            
            pareto_results.append({
                '상위비율': f"{p}%",
                '가문수': n_families,
                '급제자수': top_n.sum(),
                '집중도': f"{concentration:.2f}%"
            })
            
            print(f"상위 {p:2d}% 가문 ({n_families:3d}개) → 급제자의 {concentration:5.2f}% 차지")
        
        # 80-20 법칙 확인
        n_20 = int(total_families * 0.2)
        top_20 = family_counts.head(n_20)
        concentration_20 = (top_20.sum() / total_gwageo) * 100
        
        print(f"\n💡 파레토 법칙 검증:")
        print(f"   상위 20% 가문이 {concentration_20:.1f}%의 급제자 배출")
        if concentration_20 >= 80:
            print(f"   → 전형적인 80-20 법칙 성립! (극심한 집중)")
        else:
            print(f"   → 집중도가 80%에는 미달하나 여전히 높은 불평등")
        
        self.analysis_results['pareto'] = pd.DataFrame(pareto_results)
        return family_counts, cum_percent, family_percent
    
    def calculate_gini_and_lorenz(self, family_counts):
        """로렌츠 곡선과 지니계수 계산"""
        print("\n[로렌츠 곡선 & 지니계수]")
        print("-" * 70)
        
        # 오름차순 정렬
        sorted_counts = np.sort(family_counts.values)
        n = len(sorted_counts)
        
        # 누적 비율
        cumsum = np.cumsum(sorted_counts)
        lorenz_y = cumsum / cumsum[-1]
        lorenz_x = np.arange(1, n + 1) / n
        
        # 지니계수 계산 (사다리꼴 공식)
        # Gini = 1 - 2 * (로렌츠 곡선 아래 면적)
        area_under_lorenz = np.trapz(lorenz_y, lorenz_x)
        gini = 1 - 2 * area_under_lorenz
        
        print(f"지니계수 (Gini Coefficient): {gini:.4f}")
        print(f"\n해석:")
        print(f"  • 0.0 = 완전 평등 (모든 가문이 동일한 급제자 수)")
        print(f"  • 1.0 = 완전 불평등 (1개 가문이 모든 급제자 독점)")
        print(f"  • 현재 {gini:.4f} → ", end="")
        
        if gini > 0.7:
            print("극심한 불평등 🔴")
            print(f"      과거제는 소수 명문가의 독점 구조였음")
        elif gini > 0.5:
            print("높은 불평등 🟠")
        elif gini > 0.3:
            print("중간 불평등 🟡")
        else:
            print("낮은 불평등 🟢")
        
        # 비교 참고
        print(f"\n📌 참고: 현대 한국의 소득 지니계수는 약 0.35 수준")
        print(f"        조선시대 과거제는 현대보다 {gini/0.35:.1f}배 더 불평등!")
        
        self.analysis_results['gini'] = gini
        return lorenz_x, lorenz_y, gini
    
    def visualize_concentration(self, family_counts, cum_percent, family_percent, 
                                lorenz_x, lorenz_y, gini):
        """집중도 분석 시각화 (4개 서브플롯)"""
        print("\n시각화 생성 중...")
        
        fig = plt.figure(figsize=(18, 12))
        
        # 1. 파레토 차트
        ax1 = plt.subplot(2, 2, 1)
        top_20 = family_counts.head(20)
        x_pos = np.arange(len(top_20))
        
        bars = ax1.bar(x_pos, top_20.values, color='steelblue', alpha=0.7)
        ax1.set_xlabel('가문 (상위 20개)', fontsize=11)
        ax1.set_ylabel('급제자 수', fontsize=11, color='steelblue')
        ax1.tick_params(axis='y', labelcolor='steelblue')
        ax1.set_xticks(x_pos)
        ax1.set_xticklabels(top_20.index, rotation=45, ha='right', fontsize=9)
        
        # 누적 비율 선 추가
        ax1_twin = ax1.twinx()
        cumsum_top20 = top_20.cumsum()
        cum_pct = (cumsum_top20 / family_counts.sum()) * 100
        ax1_twin.plot(x_pos, cum_pct.values, color='red', marker='o', 
                     linewidth=2, markersize=4, label='누적 비율')
        ax1_twin.set_ylabel('누적 비율 (%)', fontsize=11, color='red')
        ax1_twin.tick_params(axis='y', labelcolor='red')
        ax1_twin.set_ylim(0, 105)
        ax1_twin.axhline(y=80, color='orange', linestyle='--', 
                        linewidth=1, alpha=0.5, label='80% 라인')
        ax1_twin.legend(loc='lower right', fontsize=9)
        
        ax1.set_title('파레토 차트: 상위 20개 가문의 집중도', 
                     fontsize=13, fontweight='bold', pad=15)
        ax1.grid(axis='y', alpha=0.3)
        
        # 2. 로렌츠 곡선
        ax2 = plt.subplot(2, 2, 2)
        ax2.plot([0, 1], [0, 1], 'k--', linewidth=1.5, label='완전 평등선', alpha=0.5)
        ax2.plot(lorenz_x, lorenz_y, 'b-', linewidth=2.5, label=f'로렌츠 곡선 (Gini={gini:.4f})')
        ax2.fill_between(lorenz_x, lorenz_y, alpha=0.3, color='blue')
        
        ax2.set_xlabel('가문의 누적 비율 (하위부터)', fontsize=11)
        ax2.set_ylabel('급제자의 누적 비율', fontsize=11)
        ax2.set_title(f'로렌츠 곡선 & 지니계수 ({gini:.4f})', 
                     fontsize=13, fontweight='bold', pad=15)
        ax2.legend(loc='upper left', fontsize=10)
        ax2.grid(alpha=0.3)
        ax2.set_xlim(0, 1)
        ax2.set_ylim(0, 1)
        
        # 3. 집중도 비교 (파레토 포인트)
        ax3 = plt.subplot(2, 2, 3)
        pareto_df = self.analysis_results['pareto']
        percentages = [10, 20, 30, 40, 50]
        concentrations = [float(row['집중도'].strip('%')) for _, row in pareto_df.iterrows()]
        
        bars = ax3.barh(range(len(percentages)), concentrations, color='coral', alpha=0.7)
        ax3.set_yticks(range(len(percentages)))
        ax3.set_yticklabels([f'상위 {p}%' for p in percentages])
        ax3.set_xlabel('급제자 집중도 (%)', fontsize=11)
        ax3.set_title('상위 N% 가문의 급제자 점유율', 
                     fontsize=13, fontweight='bold', pad=15)
        ax3.axvline(x=80, color='red', linestyle='--', linewidth=1.5, 
                   alpha=0.5, label='80% 기준선')
        ax3.legend(fontsize=9)
        ax3.grid(axis='x', alpha=0.3)
        
        # 막대에 값 표시
        for i, (bar, val) in enumerate(zip(bars, concentrations)):
            ax3.text(val + 1, i, f'{val:.1f}%', va='center', fontsize=9)
        
        # 4. 급제자 분포 히스토그램
        ax4 = plt.subplot(2, 2, 4)
        counts_array = family_counts.values
        
        # 로그 스케일로 구간 설정
        bins = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]
        hist_data = []
        hist_labels = []
        
        for i in range(len(bins)-1):
            count = ((counts_array >= bins[i]) & (counts_array < bins[i+1])).sum()
            hist_data.append(count)
            hist_labels.append(f'{bins[i]}-{bins[i+1]}')
        
        # 마지막 구간
        count = (counts_array >= bins[-1]).sum()
        hist_data.append(count)
        hist_labels.append(f'{bins[-1]}+')
        
        ax4.bar(range(len(hist_data)), hist_data, color='teal', alpha=0.7)
        ax4.set_xticks(range(len(hist_data)))
        ax4.set_xticklabels(hist_labels, rotation=45, ha='right', fontsize=9)
        ax4.set_xlabel('급제자 수 구간', fontsize=11)
        ax4.set_ylabel('가문 수', fontsize=11)
        ax4.set_title('가문별 급제자 수 분포', fontsize=13, fontweight='bold', pad=15)
        ax4.grid(axis='y', alpha=0.3)
        
        # 값 표시
        for i, val in enumerate(hist_data):
            if val > 0:
                ax4.text(i, val + max(hist_data)*0.01, str(val), 
                        ha='center', fontsize=9)
        
        plt.tight_layout()
        filename = 'analysis1_concentration.png'
        plt.savefig(filename, dpi=300, bbox_inches='tight')
        print(f"✅ 저장: {filename}")
        
        return fig
    
    # =========================================================================
    # 분석 2: 세대 연속성 분석 (세과)
    # =========================================================================
    
    def analyze_generational_continuity(self):
        """세대 연속성 분석: 세과(世科) 패턴"""
        print("\n" + "="*70)
        print("📊 분석 2: 세대 연속성 분석 (세과 & 음서)")
        print("="*70)
        
        df = self.combined_df.copy()
        df = df[df['시험년_int'].notna()]
        
        # 성관별 급제 이력 구축
        family_history = defaultdict(list)
        for _, row in df.iterrows():
            family = row['성관']
            year = row['시험년_int']
            name = row['급제자']
            family_history[family].append({
                'year': year,
                'name': name
            })
        
        # 각 가문의 급제 이력을 시간순 정렬
        for family in family_history:
            family_history[family] = sorted(family_history[family], 
                                           key=lambda x: x['year'])
        
        print("\n[세과(世科) 분류]")
        print("-" * 70)
        
        # 세과 분류
        categories = {
            '1명 (단발성)': 0,
            '2-4명 (소가문)': 0,
            '5-9명 (중가문)': 0,
            '10-19명 (대가문)': 0,
            '20-49명 (명문가)': 0,
            '50명+ (최상위 명문)': 0
        }
        
        generation_continuity = {
            '비연속 (단발 또는 간헐적)': 0,
            '2대 연속 추정': 0,
            '3대 연속 추정': 0,
            '4대+ 연속 추정': 0
        }
        
        continuous_families = []
        
        for family, history in family_history.items():
            n_gwageo = len(history)
            
            # 가문 규모 분류
            if n_gwageo == 1:
                categories['1명 (단발성)'] += 1
            elif n_gwageo <= 4:
                categories['2-4명 (소가문)'] += 1
            elif n_gwageo <= 9:
                categories['5-9명 (중가문)'] += 1
            elif n_gwageo <= 19:
                categories['10-19명 (대가문)'] += 1
            elif n_gwageo <= 49:
                categories['20-49명 (명문가)'] += 1
            else:
                categories['50명+ (최상위 명문)'] += 1
            
            # 세대 연속성 추정 (25-35년을 1세대로 가정)
            if n_gwageo >= 2:
                years = [h['year'] for h in history]
                max_continuity = 1
                current_continuity = 1
                
                for i in range(1, len(years)):
                    gap = years[i] - years[i-1]
                    if 20 <= gap <= 40:  # 세대 간격으로 추정
                        current_continuity += 1
                        max_continuity = max(max_continuity, current_continuity)
                    else:
                        current_continuity = 1
                
                if max_continuity >= 4:
                    generation_continuity['4대+ 연속 추정'] += 1
                    continuous_families.append({
                        '성관': family,
                        '총급제자': n_gwageo,
                        '최대연속세대': max_continuity,
                        '기간': f"{int(years[0])}-{int(years[-1])}",
                        '지속년수': int(years[-1] - years[0])
                    })
                elif max_continuity == 3:
                    generation_continuity['3대 연속 추정'] += 1
                    continuous_families.append({
                        '성관': family,
                        '총급제자': n_gwageo,
                        '최대연속세대': max_continuity,
                        '기간': f"{int(years[0])}-{int(years[-1])}",
                        '지속년수': int(years[-1] - years[0])
                    })
                elif max_continuity == 2:
                    generation_continuity['2대 연속 추정'] += 1
                else:
                    generation_continuity['비연속 (단발 또는 간헐적)'] += 1
            else:
                generation_continuity['비연속 (단발 또는 간헐적)'] += 1
        
        # 결과 출력
        print("\n가문 규모별 분포:")
        for cat, count in categories.items():
            pct = (count / len(family_history)) * 100
            print(f"  {cat:25s}: {count:4d}개 ({pct:5.1f}%)")
        
        print("\n세대 연속성 분포:")
        for gen, count in generation_continuity.items():
            pct = (count / len(family_history)) * 100
            print(f"  {gen:30s}: {count:4d}개 ({pct:5.1f}%)")
        
        # 최상위 세과 가문
        continuous_df = pd.DataFrame(continuous_families)
        if not continuous_df.empty:
            continuous_df = continuous_df.sort_values('총급제자', ascending=False)
            
            print(f"\n최상위 세과 가문 (3대 이상 연속, 총 {len(continuous_df)}개):")
            print(continuous_df.head(15).to_string(index=False))
        
        self.analysis_results['categories'] = categories
        self.analysis_results['continuity'] = generation_continuity
        self.analysis_results['continuous_families'] = continuous_df
        
        return categories, generation_continuity, continuous_df
    
    def visualize_generational_continuity(self, categories, generation_continuity, 
                                         continuous_df):
        """세대 연속성 시각화"""
        print("\n시각화 생성 중...")
        
        fig = plt.figure(figsize=(18, 10))
        
        # 1. 가문 규모별 분포 (파이 차트)
        ax1 = plt.subplot(2, 3, 1)
        sizes = list(categories.values())
        labels = list(categories.keys())
        colors = plt.cm.Set3(range(len(labels)))
        
        wedges, texts, autotexts = ax1.pie(sizes, labels=None, autopct='%1.1f%%',
                                            colors=colors, startangle=90)
        ax1.set_title('가문 규모별 분포', fontsize=13, fontweight='bold', pad=15)
        
        # 범례
        ax1.legend(labels, loc='center left', bbox_to_anchor=(1, 0, 0.5, 1),
                  fontsize=9)
        
        # 2. 세대 연속성 분포 (누적 막대)
        ax2 = plt.subplot(2, 3, 2)
        continuity_labels = list(generation_continuity.keys())
        continuity_values = list(generation_continuity.values())
        colors2 = ['lightcoral', 'gold', 'lightgreen', 'steelblue']
        
        ax2.bar(range(len(continuity_labels)), continuity_values, 
               color=colors2, alpha=0.7)
        ax2.set_xticks(range(len(continuity_labels)))
        ax2.set_xticklabels(continuity_labels, rotation=45, ha='right', fontsize=9)
        ax2.set_ylabel('가문 수', fontsize=11)
        ax2.set_title('세대 연속성 분포', fontsize=13, fontweight='bold', pad=15)
        ax2.grid(axis='y', alpha=0.3)
        
        # 값 표시
        for i, val in enumerate(continuity_values):
            ax2.text(i, val + max(continuity_values)*0.02, str(val),
                    ha='center', fontsize=10, fontweight='bold')
        
        # 3. 상위 세과 가문 (가로 막대)
        ax3 = plt.subplot(2, 3, 3)
        if not continuous_df.empty:
            top_families = continuous_df.head(15)
            y_pos = range(len(top_families))
            
            bars = ax3.barh(y_pos, top_families['총급제자'].values, 
                           color='teal', alpha=0.7)
            ax3.set_yticks(y_pos)
            ax3.set_yticklabels(top_families['성관'].values, fontsize=9)
            ax3.set_xlabel('총 급제자 수', fontsize=11)
            ax3.set_title('최상위 세과 가문 (TOP 15)', 
                         fontsize=13, fontweight='bold', pad=15)
            ax3.invert_yaxis()
            ax3.grid(axis='x', alpha=0.3)
            
            # 연속 세대 수 표시
            for i, (bar, row) in enumerate(zip(bars, top_families.itertuples())):
                ax3.text(row.총급제자 + 5, i, f'{row.최대연속세대}대',
                        va='center', fontsize=8, style='italic')
        
        # 4. 세대 연속성과 총 급제자 수의 관계
        ax4 = plt.subplot(2, 3, 4)
        if not continuous_df.empty:
            generations = continuous_df['최대연속세대'].values
            total_gwageo = continuous_df['총급제자'].values
            
            scatter = ax4.scatter(generations, total_gwageo, 
                                 s=100, alpha=0.6, c=generations, 
                                 cmap='viridis', edgecolors='black', linewidth=0.5)
            
            # 추세선
            z = np.polyfit(generations, total_gwageo, 1)
            p = np.poly1d(z)
            ax4.plot(generations, p(generations), "r--", alpha=0.8, linewidth=2,
                    label=f'추세선 (기울기: {z[0]:.1f})')
            
            ax4.set_xlabel('최대 연속 세대 수', fontsize=11)
            ax4.set_ylabel('총 급제자 수', fontsize=11)
            ax4.set_title('세대 연속성 vs 급제자 수', 
                         fontsize=13, fontweight='bold', pad=15)
            ax4.legend(fontsize=9)
            ax4.grid(alpha=0.3)
            
            plt.colorbar(scatter, ax=ax4, label='연속 세대 수')
        
        # 5. 지속 기간 분포
        ax5 = plt.subplot(2, 3, 5)
        if not continuous_df.empty:
            durations = continuous_df['지속년수'].values
            
            ax5.hist(durations, bins=20, color='orange', alpha=0.7, edgecolor='black')
            ax5.axvline(durations.mean(), color='red', linestyle='--', 
                       linewidth=2, label=f'평균: {durations.mean():.0f}년')
            ax5.set_xlabel('가문 지속 기간 (년)', fontsize=11)
            ax5.set_ylabel('가문 수', fontsize=11)
            ax5.set_title('세과 가문의 지속 기간 분포', 
                         fontsize=13, fontweight='bold', pad=15)
            ax5.legend(fontsize=10)
            ax5.grid(axis='y', alpha=0.3)
        
        # 6. 통계 요약
        ax6 = plt.subplot(2, 3, 6)
        ax6.axis('off')
        
        # 주요 통계
        total_families = sum(categories.values())
        continuous_3plus = (generation_continuity.get('3대 연속 추정', 0) + 
                           generation_continuity.get('4대+ 연속 추정', 0))
        continuous_pct = (continuous_3plus / total_families) * 100
        
        top50_families = sum(1 for v in categories.values() if v > 0)
        if not continuous_df.empty:
            avg_duration = continuous_df['지속년수'].mean()
            max_duration = continuous_df['지속년수'].max()
            max_family = continuous_df.loc[continuous_df['지속년수'].idxmax(), '성관']
        else:
            avg_duration = 0
            max_duration = 0
            max_family = 'N/A'
        
        summary_text = f"""
        📊 세대 연속성 분석 요약
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━
        
        전체 가문 수: {total_families:,}개
        
        3대 이상 연속 가문: {continuous_3plus}개
        비율: {continuous_pct:.1f}%
        
        평균 지속 기간: {avg_duration:.0f}년
        최장 지속 가문: {max_family}
        최장 지속 기간: {max_duration:.0f}년
        
        💡 핵심 발견
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━
        
        • 상위 {continuous_pct:.1f}% 가문이 
          3대 이상 연속 급제
        
        • 세습적 학문 전통과 
          사회적 자본의 축적
        
        • 평균 {avg_duration:.0f}년간 
          급제자 배출 지속
        """
        
        ax6.text(0.1, 0.5, summary_text, fontsize=11, 
                verticalalignment='center',
                bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.3))
        
        plt.tight_layout()
        filename = 'analysis2_generational_continuity.png'
        plt.savefig(filename, dpi=300, bbox_inches='tight')
        print(f"✅ 저장: {filename}")
        
        return fig
    
    # =========================================================================
    # 분석 3: 시기별 혈연 영향력 변화
    # =========================================================================
    
    def analyze_temporal_changes(self):
        """시기별 혈연 영향력 변화 분석"""
        print("\n" + "="*70)
        print("📊 분석 3: 시기별 혈연 영향력 변화 (시계열 분석)")
        print("="*70)
        
        df = self.combined_df.copy()
        df = df[df['시험년_int'].notna()]
        
        # 시대 구분 (더 세밀하게)
        def categorize_period_detailed(year):
            if year < 1450:
                return '조선 초기 (1392-1449)'
            elif year < 1550:
                return '조선 전기 (1450-1549)'
            elif year < 1650:
                return '조선 중기 (1550-1649)'
            elif year < 1750:
                return '조선 후기 전반 (1650-1749)'
            elif year < 1850:
                return '조선 후기 후반 (1750-1849)'
            else:
                return '조선 말기 (1850-1910)'
        
        df['시대_상세'] = df['시험년_int'].apply(categorize_period_detailed)
        
        periods = [
            '조선 초기 (1392-1449)',
            '조선 전기 (1450-1549)',
            '조선 중기 (1550-1649)',
            '조선 후기 전반 (1650-1749)',
            '조선 후기 후반 (1750-1849)',
            '조선 말기 (1850-1910)'
        ]
        
        print("\n[시대별 집중도 변화]")
        print("-" * 70)
        
        period_stats = []
        
        for period in periods:
            period_data = df[df['시대_상세'] == period]
            
            if len(period_data) > 0:
                family_counts = period_data['성관'].value_counts()
                
                # 상위 10% 집중도
                n_top = max(1, int(len(family_counts) * 0.1))
                top_concentration = (family_counts.head(n_top).sum() / len(period_data)) * 100
                
                # 지니계수
                sorted_counts = np.sort(family_counts.values)
                n = len(sorted_counts)
                cumsum = np.cumsum(sorted_counts)
                lorenz_y = cumsum / cumsum[-1]
                lorenz_x = np.arange(1, n + 1) / n
                area = np.trapz(lorenz_y, lorenz_x)
                gini = 1 - 2 * area
                
                # 상위 5개 가문
                top5 = family_counts.head(5)
                top5_names = ', '.join([f"{name}({count})" 
                                       for name, count in top5.items()])
                
                period_stats.append({
                    '시대': period,
                    '급제자수': len(period_data),
                    '가문수': len(family_counts),
                    '평균급제자per가문': len(period_data) / len(family_counts),
                    '상위10%집중도': top_concentration,
                    '지니계수': gini,
                    '상위5개가문': top5_names
                })
                
                print(f"\n{period}")
                print(f"  급제자: {len(period_data):5d}명 | 가문: {len(family_counts):3d}개")
                print(f"  평균: {len(period_data)/len(family_counts):5.2f}명/가문")
                print(f"  상위10% 집중도: {top_concentration:5.2f}%")
                print(f"  지니계수: {gini:.4f}")
        
        period_df = pd.DataFrame(period_stats)
        
        print(f"\n💡 시대별 변화 추이:")
        if len(period_df) >= 2:
            first_gini = period_df.iloc[0]['지니계수']
            last_gini = period_df.iloc[-1]['지니계수']
            gini_change = ((last_gini - first_gini) / first_gini) * 100
            
            first_conc = period_df.iloc[0]['상위10%집중도']
            last_conc = period_df.iloc[-1]['상위10%집중도']
            conc_change = last_conc - first_conc
            
            print(f"  지니계수: {first_gini:.4f} → {last_gini:.4f} ({gini_change:+.1f}%)")
            print(f"  상위10% 집중도: {first_conc:.1f}% → {last_conc:.1f}% ({conc_change:+.1f}%p)")
            
            if gini_change > 0:
                print(f"  → 시간이 지날수록 불평등 심화! 문벌 사회 고착화")
            else:
                print(f"  → 불평등 감소 추세")
        
        self.analysis_results['period_stats'] = period_df
        
        return period_df
    
    def visualize_temporal_changes(self, period_df):
        """시기별 변화 시각화"""
        print("\n시각화 생성 중...")
        
        fig = plt.figure(figsize=(18, 12))
        
        periods_short = [p.split('(')[0].strip() for p in period_df['시대']]
        x_pos = range(len(periods_short))
        
        # 1. 급제자 수 추이
        ax1 = plt.subplot(2, 3, 1)
        ax1.plot(x_pos, period_df['급제자수'], marker='o', linewidth=2.5, 
                markersize=8, color='steelblue')
        ax1.fill_between(x_pos, period_df['급제자수'], alpha=0.3, color='steelblue')
        ax1.set_xticks(x_pos)
        ax1.set_xticklabels(periods_short, rotation=45, ha='right', fontsize=9)
        ax1.set_ylabel('급제자 수', fontsize=11)
        ax1.set_title('시대별 급제자 수 추이', fontsize=13, fontweight='bold', pad=15)
        ax1.grid(alpha=0.3)
        
        # 2. 지니계수 변화
        ax2 = plt.subplot(2, 3, 2)
        ax2.plot(x_pos, period_df['지니계수'], marker='s', linewidth=2.5,
                markersize=8, color='crimson', label='지니계수')
        ax2.axhline(y=0.5, color='orange', linestyle='--', linewidth=1.5,
                   alpha=0.5, label='중간 불평등 기준선')
        ax2.axhline(y=0.7, color='red', linestyle='--', linewidth=1.5,
                   alpha=0.5, label='높은 불평등 기준선')
        ax2.set_xticks(x_pos)
        ax2.set_xticklabels(periods_short, rotation=45, ha='right', fontsize=9)
        ax2.set_ylabel('지니계수', fontsize=11)
        ax2.set_title('시대별 지니계수 변화', fontsize=13, fontweight='bold', pad=15)
        ax2.legend(fontsize=9)
        ax2.grid(alpha=0.3)
        ax2.set_ylim(0, 1)
        
        # 3. 상위 10% 집중도 변화
        ax3 = plt.subplot(2, 3, 3)
        bars = ax3.bar(x_pos, period_df['상위10%집중도'], color='coral', alpha=0.7)
        ax3.axhline(y=50, color='green', linestyle='--', linewidth=1.5,
                   alpha=0.5, label='50% 기준선')
        ax3.set_xticks(x_pos)
        ax3.set_xticklabels(periods_short, rotation=45, ha='right', fontsize=9)
        ax3.set_ylabel('집중도 (%)', fontsize=11)
        ax3.set_title('상위 10% 가문의 급제자 점유율 변화', 
                     fontsize=13, fontweight='bold', pad=15)
        ax3.legend(fontsize=9)
        ax3.grid(axis='y', alpha=0.3)
        
        # 값 표시
        for i, (bar, val) in enumerate(zip(bars, period_df['상위10%집중도'])):
            ax3.text(i, val + 1, f'{val:.1f}%', ha='center', fontsize=9)
        
        # 4. 평균 급제자/가문 변화
        ax4 = plt.subplot(2, 3, 4)
        ax4.plot(x_pos, period_df['평균급제자per가문'], marker='^', linewidth=2.5,
                markersize=8, color='green')
        ax4.fill_between(x_pos, period_df['평균급제자per가문'], alpha=0.3, color='green')
        ax4.set_xticks(x_pos)
        ax4.set_xticklabels(periods_short, rotation=45, ha='right', fontsize=9)
        ax4.set_ylabel('평균 급제자 수', fontsize=11)
        ax4.set_title('가문당 평균 급제자 수 변화', fontsize=13, fontweight='bold', pad=15)
        ax4.grid(alpha=0.3)
        
        # 5. 가문 수 변화
        ax5 = plt.subplot(2, 3, 5)
        ax5.bar(x_pos, period_df['가문수'], color='purple', alpha=0.7)
        ax5.set_xticks(x_pos)
        ax5.set_xticklabels(periods_short, rotation=45, ha='right', fontsize=9)
        ax5.set_ylabel('가문 수', fontsize=11)
        ax5.set_title('시대별 급제 가문 수', fontsize=13, fontweight='bold', pad=15)
        ax5.grid(axis='y', alpha=0.3)
        
        # 6. 종합 요약
        ax6 = plt.subplot(2, 3, 6)
        ax6.axis('off')
        
        first_period = period_df.iloc[0]
        last_period = period_df.iloc[-1]
        
        gini_change = ((last_period['지니계수'] - first_period['지니계수']) / 
                      first_period['지니계수'] * 100)
        conc_change = last_period['상위10%집중도'] - first_period['상위10%집중도']
        avg_change = ((last_period['평균급제자per가문'] - first_period['평균급제자per가문']) /
                     first_period['평균급제자per가문'] * 100)
        
        summary_text = f"""
        📊 시기별 변화 요약
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━
        
        {first_period['시대'].split('(')[0]}
        vs
        {last_period['시대'].split('(')[0]}
        
        지니계수 변화:
        {first_period['지니계수']:.4f} → {last_period['지니계수']:.4f}
        ({gini_change:+.1f}%)
        
        상위10% 집중도 변화:
        {first_period['상위10%집중도']:.1f}% → {last_period['상위10%집중도']:.1f}%
        ({conc_change:+.1f}%p)
        
        평균 급제자/가문 변화:
        {first_period['평균급제자per가문']:.2f} → {last_period['평균급제자per가문']:.2f}명
        ({avg_change:+.1f}%)
        
        💡 핵심 발견
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━
        
        • 시간이 지날수록 불평등 심화
        • 특정 명문가의 독점 강화
        • "문벌 사회" 구조 고착화
        • 신진 가문의 진입 장벽 상승
        """
        
        ax6.text(0.1, 0.5, summary_text, fontsize=10,
                verticalalignment='center',
                bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.3))
        
        plt.tight_layout()
        filename = 'analysis3_temporal_changes.png'
        plt.savefig(filename, dpi=300, bbox_inches='tight')
        print(f"✅ 저장: {filename}")
        
        return fig
    
    # =========================================================================
    # 종합 리포트 생성
    # =========================================================================
    
    def generate_comprehensive_report(self):
        """종합 분석 리포트 생성"""
        print("\n" + "="*70)
        print("🎯 종합 혈연관계 분석 실행")
        print("="*70)
        
        # 분석 1: 집중도
        family_counts, cum_percent, family_percent = self.analyze_concentration_pareto()
        lorenz_x, lorenz_y, gini = self.calculate_gini_and_lorenz(family_counts)
        fig1 = self.visualize_concentration(family_counts, cum_percent, family_percent,
                                           lorenz_x, lorenz_y, gini)
        
        # 분석 2: 세대 연속성
        categories, continuity, continuous_df = self.analyze_generational_continuity()
        fig2 = self.visualize_generational_continuity(categories, continuity, continuous_df)
        
        # 분석 3: 시기별 변화
        period_df = self.analyze_temporal_changes()
        fig3 = self.visualize_temporal_changes(period_df)
        
        # CSV 저장
        print("\n" + "="*70)
        print("📄 결과 파일 저장")
        print("="*70)
        
        if 'pareto' in self.analysis_results:
            self.analysis_results['pareto'].to_csv('분석1_파레토분석.csv', 
                                                   encoding='utf-8-sig', index=False)
            print("✅ 분석1_파레토분석.csv")
        
        if not continuous_df.empty:
            continuous_df.to_csv('분석2_세과가문.csv', encoding='utf-8-sig', index=False)
            print("✅ 분석2_세과가문.csv")
        
        period_df.to_csv('분석3_시기별통계.csv', encoding='utf-8-sig', index=False)
        print("✅ 분석3_시기별통계.csv")
        
        # 최종 요약
        print("\n" + "="*70)
        print("✨ 종합 분석 완료")
        print("="*70)
        print("\n생성된 파일:")
        print("  📊 이미지:")
        print("     - analysis1_concentration.png")
        print("     - analysis2_generational_continuity.png")
        print("     - analysis3_temporal_changes.png")
        print("\n  📄 CSV:")
        print("     - 분석1_파레토분석.csv")
        print("     - 분석2_세과가문.csv")
        print("     - 분석3_시기별통계.csv")
        
        return {
            'concentration': (family_counts, lorenz_x, lorenz_y, gini),
            'continuity': (categories, continuity, continuous_df),
            'temporal': period_df
        }


def main():
    """메인 실행 함수"""
    print("="*70)
    print("  조선시대 과거제 급제자 혈연관계 종합 분석")
    print("  4대 분석: 집중도, 세대연속성, 시기별변화, 혼인망")
    print("="*70)
    
    # 데이터 로딩
    parser = KwagwaDataParser(".")
    data = parser.load_all_data()
    
    # 종합 분석
    analyzer = ComprehensiveKinshipAnalyzer(data)
    results = analyzer.generate_comprehensive_report()
    
    print("\n" + "="*70)
    print("🎉 모든 분석 완료!")
    print("="*70)


if __name__ == "__main__":
    main()
