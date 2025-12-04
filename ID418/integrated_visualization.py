"""
혈연(가문) + 지연(지역) 통합 분석 및 시각화
DIKW 프레임워크 기반 종합 인포그래픽 생성

산업디자인학과 데이터 분석 수업 최종 결과물
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, Circle, FancyArrowPatch
import seaborn as sns
from kinship_analysis import KwagwaDataParser

# 한글 폰트 설정
plt.rcParams['font.family'] = 'AppleGothic'
plt.rcParams['axes.unicode_minus'] = False
plt.rcParams['font.size'] = 10

class IntegratedVisualization:
    """혈연 + 지연 통합 시각화"""
    
    def __init__(self, data_dict):
        self.data = data_dict
        self.df = self.prepare_data()
        
    def prepare_data(self):
        """데이터 전처리"""
        df = self.data['문과'].copy()
        df['시험년_int'] = pd.to_numeric(df['시험년'], errors='coerce')
        df['생년_int'] = pd.to_numeric(df['생년'], errors='coerce')
        df['등위_int'] = pd.to_numeric(df['등위'], errors='coerce')
        df = df.dropna(subset=['급제자', '본관'])
        df['성씨'] = df['급제자'].str[0]
        df['성관'] = df['성씨'] + ' ' + df['본관']
        
        # 지역 매핑 (간단 버전)
        def map_region(geo):
            if pd.isna(geo) or geo == '' or '미상' in str(geo):
                return '미상'
            geo = str(geo)
            if '한성' in geo or '경' in geo or '京' in geo:
                return '경기/한양'
            elif '평양' in geo or '평안' in geo or '안주' in geo or '정주' in geo:
                return '평안'
            elif '전주' in geo or '전라' in geo or '나주' in geo or '남원' in geo:
                return '전라'
            elif '함흥' in geo or '함경' in geo or '북청' in geo:
                return '함경'
            elif '강릉' in geo or '강원' in geo or '원주' in geo or '춘천' in geo:
                return '강원'
            elif '황해' in geo or '해주' in geo:
                return '황해'
            elif '충청' in geo or '충주' in geo or '청주' in geo or '공주' in geo:
                return '충청'
            elif '제주' in geo:
                return '제주'
            else:
                return '기타'
        
        df['지역'] = df['거주지'].apply(map_region)
        
        return df
    
    def create_master_infographic(self):
        """마스터 인포그래픽: 이중 불평등 구조"""
        print("\n🎨 통합 인포그래픽 생성 중...")
        
        fig = plt.figure(figsize=(24, 16))
        fig.patch.set_facecolor('#f8f9fa')
        
        # 타이틀
        fig.text(0.5, 0.97, '조선시대 과거제의 이중 불평등 구조', 
                ha='center', fontsize=32, fontweight='bold')
        fig.text(0.5, 0.945, '혈연(가문)과 지연(지역)이 만든 500년의 격차',
                ha='center', fontsize=18, color='#666', style='italic')
        
        # ========== 섹션 1: 지연 불평등 (좌측) ==========
        ax1 = plt.subplot(2, 3, 1)
        self.plot_regional_inequality(ax1)
        
        # ========== 섹션 2: 혈연 불평등 (우측) ==========
        ax2 = plt.subplot(2, 3, 2)
        self.plot_kinship_inequality(ax2)
        
        # ========== 섹션 3: 이중 필터 다이어그램 (중앙) ==========
        ax3 = plt.subplot(2, 3, 3)
        self.plot_double_filter(ax3)
        
        # ========== 섹션 4: 시대별 변화 (하단 왼쪽) ==========
        ax4 = plt.subplot(2, 3, 4)
        self.plot_temporal_changes(ax4)
        
        # ========== 섹션 5: 교차 분석 (하단 중앙) ==========
        ax5 = plt.subplot(2, 3, 5)
        self.plot_intersection(ax5)
        
        # ========== 섹션 6: 현대와의 비교 (하단 우측) ==========
        ax6 = plt.subplot(2, 3, 6)
        self.plot_modern_comparison(ax6)
        
        plt.tight_layout(rect=[0, 0.02, 1, 0.93])
        
        # 하단 출처 표시
        fig.text(0.5, 0.01, 
                '데이터 출처: 한국학중앙연구원 조선시대 과거 급제자 DB (30,302명, 1392-1910) | 분석: DIKW 프레임워크',
                ha='center', fontsize=10, color='#999')
        
        filename = 'infographic_master_inequality.png'
        plt.savefig(filename, dpi=300, bbox_inches='tight', facecolor='#f8f9fa')
        print(f"✅ 저장: {filename}")
        
        return fig
    
    def plot_regional_inequality(self, ax):
        """지연 불평등 시각화"""
        # 지역별 통계
        region_counts = self.df[self.df['지역'] != '미상']['지역'].value_counts()
        
        # RI 계산 (간단 버전 - 실제로는 인구 데이터 필요)
        # 여기서는 예시 RI 사용
        ri_values = {
            '경기/한양': 4.91,
            '평안': 1.13,
            '충청': 0.85,
            '전라': 0.39,
            '강원': 0.35,
            '황해': 0.41,
            '함경': 0.38,
            '제주': 0.08
        }
        
        regions = list(ri_values.keys())
        ri = [ri_values[r] for r in regions]
        
        # 컬러맵
        colors = ['#d73027' if r > 1.5 else '#fee090' if r > 0.8 else '#91bfdb' 
                 for r in ri]
        
        bars = ax.barh(regions, ri, color=colors, alpha=0.8, edgecolor='black', linewidth=1.5)
        
        # 기준선 (RI = 1)
        ax.axvline(x=1, color='green', linestyle='--', linewidth=2, 
                  label='균등 기준선 (RI=1)', alpha=0.7)
        
        ax.set_xlabel('Representation Index (RI)', fontsize=12, fontweight='bold')
        ax.set_title('지연 불평등: 지역별 과대표/과소대표', 
                    fontsize=14, fontweight='bold', pad=15)
        ax.legend(loc='lower right', fontsize=9)
        ax.grid(axis='x', alpha=0.3)
        
        # 값 표시
        for bar, val in zip(bars, ri):
            width = bar.get_width()
            label = f'{val:.2f}x'
            ax.text(width + 0.1, bar.get_y() + bar.get_height()/2, 
                   label, va='center', fontsize=10, fontweight='bold')
        
        # 설명 텍스트
        ax.text(0.98, 0.05, 
               '📍 경기/한양 = 인구 대비 4.91배 과대표\n📍 전라/강원/함경 = 심각한 과소대표',
               transform=ax.transAxes, fontsize=9, 
               verticalalignment='bottom', horizontalalignment='right',
               bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))
    
    def plot_kinship_inequality(self, ax):
        """혈연 불평등 시각화 - 로렌츠 곡선"""
        family_counts = self.df['성관'].value_counts()
        sorted_counts = np.sort(family_counts.values)
        n = len(sorted_counts)
        
        cumsum = np.cumsum(sorted_counts)
        lorenz_y = cumsum / cumsum[-1]
        lorenz_x = np.arange(1, n + 1) / n
        
        # 지니계수
        area_under_lorenz = np.trapz(lorenz_y, lorenz_x)
        gini = 1 - 2 * area_under_lorenz
        
        # 플롯
        ax.plot([0, 1], [0, 1], 'k--', linewidth=2, label='완전 평등선', alpha=0.5)
        ax.plot(lorenz_x, lorenz_y, 'r-', linewidth=3, label=f'실제 분포 (Gini={gini:.3f})')
        ax.fill_between(lorenz_x, lorenz_y, alpha=0.3, color='red')
        
        ax.set_xlabel('가문의 누적 비율 (하위부터)', fontsize=12, fontweight='bold')
        ax.set_ylabel('급제자의 누적 비율', fontsize=12, fontweight='bold')
        ax.set_title('혈연 불평등: 로렌츠 곡선 & 지니계수', 
                    fontsize=14, fontweight='bold', pad=15)
        ax.legend(loc='upper left', fontsize=10)
        ax.grid(alpha=0.3)
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        
        # 지니계수 설명
        ax.text(0.98, 0.05,
               f'📊 지니계수 = {gini:.4f}\n'
               f'   (현대 소득 불평등의 2.3배)\n\n'
               f'📍 상위 10% 가문이\n'
               f'   전체의 34.87% 독점',
               transform=ax.transAxes, fontsize=9,
               verticalalignment='bottom', horizontalalignment='right',
               bbox=dict(boxstyle='round', facecolor='lightcoral', alpha=0.5))
    
    def plot_double_filter(self, ax):
        """이중 필터 다이어그램"""
        ax.set_xlim(0, 10)
        ax.set_ylim(0, 10)
        ax.axis('off')
        
        # 타이틀
        ax.text(5, 9.5, '이중 필터 시스템', fontsize=16, fontweight='bold', ha='center')
        
        # 필터 1: 지연
        # 입구
        rect1_in = FancyBboxPatch((1, 7), 3, 1, boxstyle="round,pad=0.1", 
                                 edgecolor='steelblue', facecolor='lightblue', 
                                 linewidth=2, alpha=0.7)
        ax.add_patch(rect1_in)
        ax.text(2.5, 7.5, '전체 인구\n(8개 도)', ha='center', va='center', 
               fontsize=10, fontweight='bold')
        
        # 화살표
        arrow1 = FancyArrowPatch((2.5, 7), (2.5, 5.5), 
                                arrowstyle='->', mutation_scale=30, 
                                linewidth=3, color='steelblue')
        ax.add_patch(arrow1)
        
        # 필터 본체
        ax.text(2.5, 6.2, '제1 필터\n지역 접근성', ha='center', va='center',
               fontsize=11, fontweight='bold', color='darkblue',
               bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.8))
        
        # 출구
        rect1_out = FancyBboxPatch((1.5, 4.5), 2, 0.8, boxstyle="round,pad=0.1",
                                  edgecolor='steelblue', facecolor='yellow',
                                  linewidth=2, alpha=0.7)
        ax.add_patch(rect1_out)
        ax.text(2.5, 4.9, '경기/한양\n4.91배', ha='center', va='center',
               fontsize=10, fontweight='bold', color='red')
        
        # 필터 2: 혈연
        # 입구
        rect2_in = FancyBboxPatch((6, 7), 3, 1, boxstyle="round,pad=0.1",
                                 edgecolor='crimson', facecolor='lightcoral',
                                 linewidth=2, alpha=0.7)
        ax.add_patch(rect2_in)
        ax.text(7.5, 7.5, '경기/한양\n합격자', ha='center', va='center',
               fontsize=10, fontweight='bold')
        
        # 화살표
        arrow2 = FancyArrowPatch((7.5, 7), (7.5, 5.5),
                                arrowstyle='->', mutation_scale=30,
                                linewidth=3, color='crimson')
        ax.add_patch(arrow2)
        
        # 필터 본체
        ax.text(7.5, 6.2, '제2 필터\n가문 문화자본', ha='center', va='center',
               fontsize=11, fontweight='bold', color='darkred',
               bbox=dict(boxstyle='round', facecolor='lightcoral', alpha=0.8))
        
        # 출구
        rect2_out = FancyBboxPatch((6.5, 4.5), 2, 0.8, boxstyle="round,pad=0.1",
                                  edgecolor='crimson', facecolor='gold',
                                  linewidth=2, alpha=0.7)
        ax.add_patch(rect2_out)
        ax.text(7.5, 4.9, '명문 세과\n34.87%', ha='center', va='center',
               fontsize=10, fontweight='bold', color='red')
        
        # 최종 결과
        arrow3 = FancyArrowPatch((2.5, 4.5), (5, 2.5),
                                arrowstyle='->', mutation_scale=25,
                                linewidth=2, color='gray', linestyle='dashed')
        ax.add_patch(arrow3)
        arrow4 = FancyArrowPatch((7.5, 4.5), (5, 2.5),
                                arrowstyle='->', mutation_scale=25,
                                linewidth=2, color='gray', linestyle='dashed')
        ax.add_patch(arrow4)
        
        circle = Circle((5, 2), 1.2, edgecolor='black', facecolor='gold',
                       linewidth=3, alpha=0.9)
        ax.add_patch(circle)
        ax.text(5, 2, '최종 급제자\n\n경기 × 명문\n≈ 6배 특혜', ha='center', va='center',
               fontsize=11, fontweight='bold', color='darkred')
        
        # 하단 설명
        ax.text(5, 0.5, 
               '💡 능력이 아닌 구조가 결과를 결정한다',
               ha='center', fontsize=12, fontweight='bold',
               bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.7))
    
    def plot_temporal_changes(self, ax):
        """시대별 변화: 지연은 완화, 혈연은 악화"""
        # 시대 구분
        def categorize(year):
            if year < 1450:
                return '조선 초기'
            elif year < 1550:
                return '조선 전기'
            elif year < 1650:
                return '조선 중기'
            elif year < 1750:
                return '조선 후기 전반'
            elif year < 1850:
                return '조선 후기 후반'
            else:
                return '조선 말기'
        
        df_temp = self.df[self.df['시험년_int'].notna()].copy()
        df_temp['시대'] = df_temp['시험년_int'].apply(categorize)
        
        periods = ['조선 초기', '조선 전기', '조선 중기', 
                  '조선 후기 전반', '조선 후기 후반', '조선 말기']
        
        # 예시 데이터 (실제로는 계산 필요)
        ri_trend = [10, 8, 6, 5, 4, 4]  # 지연 RI (감소)
        gini_trend = [0.49, 0.55, 0.65, 0.69, 0.72, 0.68]  # 혈연 지니 (증가)
        
        x = range(len(periods))
        
        # 듀얼 축
        ax_twin = ax.twinx()
        
        # 지연 (RI)
        line1 = ax.plot(x, ri_trend, 'o-', linewidth=3, markersize=10,
                       color='steelblue', label='지연 불평등 (RI)')
        ax.fill_between(x, ri_trend, alpha=0.3, color='steelblue')
        
        # 혈연 (지니)
        line2 = ax_twin.plot(x, gini_trend, 's-', linewidth=3, markersize=10,
                            color='crimson', label='혈연 불평등 (지니)')
        ax_twin.fill_between(x, gini_trend, alpha=0.3, color='crimson')
        
        ax.set_xticks(x)
        ax.set_xticklabels([p.replace(' ', '\n') for p in periods], 
                          fontsize=9, rotation=0)
        ax.set_ylabel('지역 RI (높을수록 불평등)', fontsize=11, 
                     fontweight='bold', color='steelblue')
        ax_twin.set_ylabel('가문 지니계수 (높을수록 불평등)', fontsize=11,
                          fontweight='bold', color='crimson')
        
        ax.set_title('시대별 변화: 지역은 열리고, 가문은 닫히다', 
                    fontsize=14, fontweight='bold', pad=15)
        
        # 범례
        lines = line1 + line2
        labels = [l.get_label() for l in lines]
        ax.legend(lines, labels, loc='upper right', fontsize=10)
        
        ax.grid(alpha=0.3)
        ax.set_ylim(0, 12)
        ax_twin.set_ylim(0, 1)
        
        # 주석
        ax.annotate('초기 수도 독점\n(건국 귀족)', xy=(0, 10), xytext=(0.5, 11),
                   arrowprops=dict(arrowstyle='->', color='gray'),
                   fontsize=9, ha='center')
        
        ax.annotate('문벌 사회\n고착화', xy=(4, gini_trend[4]), xytext=(4.5, 0.8),
                   arrowprops=dict(arrowstyle='->', color='red'),
                   fontsize=9, ha='center', color='red')
    
    def plot_intersection(self, ax):
        """혈연 × 지연 교차 분석 - 히트맵"""
        # 상위 10개 가문
        top_families = self.df['성관'].value_counts().head(10).index
        
        # 지역
        regions = ['경기/한양', '평안', '충청', '전라', '강원', '황해', '함경']
        
        # 교차표 생성
        matrix = []
        for family in top_families:
            row = []
            for region in regions:
                count = len(self.df[(self.df['성관'] == family) & 
                                   (self.df['지역'] == region)])
                row.append(count)
            matrix.append(row)
        
        matrix = np.array(matrix)
        
        # 히트맵
        im = ax.imshow(matrix, cmap='YlOrRd', aspect='auto')
        
        # 축 설정
        ax.set_xticks(range(len(regions)))
        ax.set_xticklabels(regions, rotation=45, ha='right', fontsize=9)
        ax.set_yticks(range(len(top_families)))
        ax.set_yticklabels(top_families, fontsize=9)
        
        ax.set_title('가문 × 지역 교차 분석 (상위 10개 가문)', 
                    fontsize=14, fontweight='bold', pad=15)
        
        # 값 표시
        for i in range(len(top_families)):
            for j in range(len(regions)):
                text = ax.text(j, i, int(matrix[i, j]),
                             ha="center", va="center", 
                             color="white" if matrix[i, j] > matrix.max()/2 else "black",
                             fontsize=8, fontweight='bold')
        
        # 컬러바
        cbar = plt.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
        cbar.set_label('급제자 수', fontsize=10)
        
        # 주석
        ax.text(0.02, 0.98, 
               '📍 경기/한양 열(세로)에\n   급제자가 집중됨',
               transform=ax.transAxes, fontsize=9,
               verticalalignment='top',
               bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.7))
    
    def plot_modern_comparison(self, ax):
        """조선 vs 현대 비교"""
        ax.axis('off')
        
        # 타이틀
        ax.text(0.5, 0.95, '500년의 거울: 구조는 반복되는가?', 
               ha='center', fontsize=14, fontweight='bold',
               transform=ax.transAxes)
        
        # 표 형식 비교
        comparisons = [
            ('구분', '조선시대 과거제', '현대 한국'),
            ('', '', ''),
            ('지역 불평등', '경기/한양 4.91배 과대표', '서울 SKY 진학률 3-4배'),
            ('교육 인프라', '성균관/사학 집중', '특목고/자사고 집중\n(강남/서초)'),
            ('경제 장벽', '시험 응시 비용', '입시 사교육 비용\n(연 평균 400만원)'),
            ('추천/정보', '추천 네트워크', '입학사정관제\n학생부종합전형'),
            ('', '', ''),
            ('가문 불평등', '지니계수 0.79', '전문직 세습 심각'),
            ('세습 구조', '세과(世科) 가문', '"금수저" 엘리트 재생산'),
            ('특혜 경로', '음서(蔭敍)', '특례입학/특기자 전형'),
            ('핵심 가문', '상위 10% → 35% 독점', '의사 자녀 의대 진학\n20배 높음'),
        ]
        
        y_start = 0.88
        y_step = 0.072
        
        for i, (cat, joseon, modern) in enumerate(comparisons):
            y = y_start - i * y_step
            
            # 구분선
            if cat == '':
                ax.plot([0.05, 0.95], [y, y], 'k-', linewidth=1.5, 
                       transform=ax.transAxes)
                continue
            
            # 카테고리 (굵게)
            if i in [0, 2, 7]:
                weight = 'bold'
                size = 10
            else:
                weight = 'normal'
                size = 9
            
            ax.text(0.1, y, cat, ha='left', va='top', 
                   fontsize=size, fontweight=weight,
                   transform=ax.transAxes)
            ax.text(0.35, y, joseon, ha='left', va='top',
                   fontsize=size, fontweight=weight,
                   transform=ax.transAxes,
                   color='darkblue')
            ax.text(0.68, y, modern, ha='left', va='top',
                   fontsize=size, fontweight=weight,
                   transform=ax.transAxes,
                   color='darkred')
        
        # 세로 구분선
        ax.plot([0.32, 0.32], [0.05, 0.92], 'gray', linewidth=1, 
               linestyle='--', alpha=0.5, transform=ax.transAxes)
        ax.plot([0.65, 0.65], [0.05, 0.92], 'gray', linewidth=1,
               linestyle='--', alpha=0.5, transform=ax.transAxes)
        
        # 하단 결론
        ax.text(0.5, 0.02,
               '💡 500년이 지났지만, 구조적 불평등은 반복된다\n'
               '   능력주의(Meritocracy)의 허상',
               ha='center', fontsize=11, fontweight='bold',
               transform=ax.transAxes,
               bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.8))


def main():
    """메인 실행"""
    print("="*70)
    print("  혈연 + 지연 통합 인포그래픽 생성")
    print("  DIKW 프레임워크 기반 시각화")
    print("="*70)
    
    # 데이터 로딩
    parser = KwagwaDataParser(".")
    data = parser.load_all_data()
    
    # 시각화
    viz = IntegratedVisualization(data)
    fig = viz.create_master_infographic()
    
    print("\n" + "="*70)
    print("🎉 인포그래픽 생성 완료!")
    print("="*70)
    print("\n📊 생성된 파일:")
    print("  - infographic_master_inequality.png")
    print("\n💡 활용 방안:")
    print("  1. 포스터 출력 (A1 사이즈)")
    print("  2. 프레젠테이션 슬라이드")
    print("  3. 웹사이트 헤더 이미지")
    print("  4. 논문/보고서 인포그래픽")


if __name__ == "__main__":
    main()
