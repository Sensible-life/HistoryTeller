"""
조선시대 과거제 급제자 혈연관계 분석 프로그램

이 프로그램은 한국학중앙연구원의 급제자 데이터를 분석하여
혈연관계와 과거 급제의 상관관계를 파악합니다.

분석 단계:
1. 자료 수집 및 파싱 (XML → DataFrame)
2. 자료 정리 및 데이터베이스 구축 (가계 관계 연결)
3. 분석 및 해석 (통계 분석, 시각화)
"""

import xml.etree.ElementTree as ET
import pandas as pd
import numpy as np
from collections import defaultdict, Counter
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

# 한글 폰트 설정 (matplotlib)
plt.rcParams['font.family'] = 'AppleGothic'  # macOS용
plt.rcParams['axes.unicode_minus'] = False  # 마이너스 기호 깨짐 방지

class KwagwaDataParser:
    """과거 급제자 데이터 파싱 클래스"""
    
    def __init__(self, base_path="."):
        self.base_path = Path(base_path)
        self.data = {}
        
    def parse_mungwa(self, filepath):
        """문과 급제자 데이터 파싱"""
        print(f"문과 데이터 파싱 중: {filepath}")
        tree = ET.parse(filepath)
        root = tree.getroot()
        
        records = []
        for item in root.findall('.//급제자'):
            record = {
                'ID': self._get_text(item, 'ID'),
                '시험명': self._get_text(item, '시험명'),
                '왕대': self._get_text(item, '왕대'),
                '왕력': self._get_text(item, '왕력'),
                '간지': self._get_text(item, '간지'),
                '시험년': self._get_text(item, '시험년'),
                '급제자': self._get_text(item, '급제자'),
                '자': self._get_text(item, '자'),
                '호': self._get_text(item, '호'),
                '시호': self._get_text(item, '시호'),
                '생년': self._get_text(item, '생년'),
                '졸년': self._get_text(item, '졸년'),
                '본관': self._get_text(item, '본관'),
                '등급': self._get_text(item, '등급'),
                '등위': self._get_text(item, '등위'),
                '거주지': self._get_text(item, '거주지'),
                '시험유형': self._get_text(item, '시험유형'),
                '과거구분': '문과'
            }
            records.append(record)
        
        df = pd.DataFrame(records)
        print(f"  → {len(df)}명의 문과 급제자 데이터 로드 완료")
        return df
    
    def parse_mugwa(self, filepath):
        """무과 급제자 데이터 파싱"""
        print(f"무과 데이터 파싱 중: {filepath}")
        tree = ET.parse(filepath)
        root = tree.getroot()
        
        records = []
        for item in root.findall('.//급제자'):
            # 무과 데이터는 필드 구조가 다름
            record = {
                '시험구분': self._get_text(item, '시험구분'),
                '왕대': self._get_text(item, '왕대'),
                '왕년': self._get_text(item, '왕년'),
                '시험년': self._get_text(item, '시험년'),  # 실제로는 이름
                '급제자': self._get_text(item, '급제자'),
                '호': self._get_text(item, '호'),
                '생년': self._get_text(item, '생년'),
                '몰년': self._get_text(item, '몰년'),
                '본관': self._get_text(item, '본관'),  # 실제로는 등급
                '등급': self._get_text(item, '등급'),  # 실제로는 등위
                '등위': self._get_text(item, '등위'),  # 실제로는 거주지
                '거주지': self._get_text(item, '거주지'),
                '전력': self._get_text(item, '전력'),
                '부명': self._get_text(item, '부명'),
                '과거구분': '무과'
            }
            records.append(record)
        
        df = pd.DataFrame(records)
        print(f"  → {len(df)}명의 무과 급제자 데이터 로드 완료")
        return df
    
    def parse_samasi(self, filepath):
        """사마시 급제자 데이터 파싱"""
        print(f"사마시 데이터 파싱 중: {filepath}")
        tree = ET.parse(filepath)
        root = tree.getroot()
        
        records = []
        for item in root.findall('.//급제자'):
            record = {
                'ID': self._get_text(item, 'ID'),
                '시험명': self._get_text(item, '시험명'),
                '왕대': self._get_text(item, '왕대'),
                '왕력': self._get_text(item, '왕력'),
                '간지': self._get_text(item, '간지'),
                '시험년': self._get_text(item, '시험년'),
                '급제자': self._get_text(item, '급제자'),
                '자': self._get_text(item, '자'),
                '호': self._get_text(item, '호'),
                '생년': self._get_text(item, '생년'),
                '졸년': self._get_text(item, '졸년'),
                '본관': self._get_text(item, '본관'),
                '등급': self._get_text(item, '등급'),
                '등위': self._get_text(item, '등위'),
                '거주지': self._get_text(item, '거주지'),
                '시험유형': self._get_text(item, '시험유형'),
                '과거구분': '사마시'
            }
            records.append(record)
        
        df = pd.DataFrame(records)
        print(f"  → {len(df)}명의 사마시 급제자 데이터 로드 완료")
        return df
    
    def parse_japgwa(self, filepath):
        """잡과 급제자 데이터 파싱"""
        print(f"잡과 데이터 파싱 중: {filepath}")
        tree = ET.parse(filepath)
        root = tree.getroot()
        
        records = []
        for item in root.findall('.//급제자'):
            record = {
                'ID': self._get_text(item, 'ID'),
                '시험명': self._get_text(item, '시험명'),
                '왕대': self._get_text(item, '왕대'),
                '왕력': self._get_text(item, '왕력'),
                '간지': self._get_text(item, '간지'),
                '시험년': self._get_text(item, '시험년'),
                '급제자': self._get_text(item, '급제자'),
                '자': self._get_text(item, '자'),
                '호': self._get_text(item, '호'),
                '생년': self._get_text(item, '생년'),
                '졸년': self._get_text(item, '졸년'),
                '본관': self._get_text(item, '본관'),
                '등급': self._get_text(item, '등급'),
                '등위': self._get_text(item, '등위'),
                '거주지': self._get_text(item, '거주지'),
                '시험유형': self._get_text(item, '시험유형'),
                '과거구분': '잡과'
            }
            records.append(record)
        
        df = pd.DataFrame(records)
        print(f"  → {len(df)}명의 잡과 급제자 데이터 로드 완료")
        return df
    
    def _get_text(self, element, tag):
        """XML 요소에서 텍스트 추출"""
        child = element.find(tag)
        return child.text if child is not None and child.text else ""
    
    def load_all_data(self):
        """모든 과거 데이터 로드"""
        print("=" * 60)
        print("과거 급제자 데이터 로딩 시작")
        print("=" * 60)
        
        # 파일 경로
        files = {
            '문과': self.base_path / '한국학중앙연구원_조선조문과급제자_20200929.xml',
            '무과': self.base_path / '한국학중앙연구원_조선조 무과급제자 정보_20200929.xml',
            '사마시': self.base_path / '한국학중앙연구원_조선조사마시급제자_20200929.xml',
            '잡과': self.base_path / '한국학중앙연구원_조선조잡과급제자_20200929.xml'
        }
        
        # 각 과거별 데이터 파싱
        self.data['문과'] = self.parse_mungwa(files['문과'])
        self.data['무과'] = self.parse_mugwa(files['무과'])
        self.data['사마시'] = self.parse_samasi(files['사마시'])
        self.data['잡과'] = self.parse_japgwa(files['잡과'])
        
        print("\n" + "=" * 60)
        print("데이터 로딩 완료")
        print("=" * 60)
        
        return self.data


class KinshipAnalyzer:
    """혈연관계 분석 클래스"""
    
    def __init__(self, data_dict):
        self.data = data_dict
        self.combined_df = None
        self.prepare_data()
    
    def prepare_data(self):
        """분석을 위한 데이터 전처리"""
        print("\n데이터 전처리 중...")
        
        # 문과 데이터를 기준으로 분석 (가장 중요한 과거)
        df = self.data['문과'].copy()
        
        # 시험년을 숫자로 변환
        df['시험년_int'] = pd.to_numeric(df['시험년'], errors='coerce')
        df['생년_int'] = pd.to_numeric(df['생년'], errors='coerce')
        
        # 결측치 처리
        df = df.dropna(subset=['급제자', '본관'])
        
        # 성씨 추출 (급제자명의 첫 글자)
        df['성씨'] = df['급제자'].str[0]
        
        # 성관(본관) 조합
        df['성관'] = df['성씨'] + ' ' + df['본관']
        
        self.combined_df = df
        print(f"전처리 완료: {len(df)}개 레코드")
    
    def analyze_bongwan_concentration(self):
        """본관별 급제자 집중도 분석"""
        print("\n[1] 본관별 급제자 집중도 분석")
        print("-" * 60)
        
        # 성관별 급제자 수 계산
        bongwan_counts = self.combined_df['성관'].value_counts()
        
        print(f"\n총 {len(bongwan_counts)}개의 성관")
        print(f"총 급제자 수: {len(self.combined_df)}명")
        print(f"\n상위 20개 성관:")
        print(bongwan_counts.head(20))
        
        # 상위 10% 성관이 차지하는 비율
        top_10pct_count = int(len(bongwan_counts) * 0.1)
        top_10pct_sum = bongwan_counts.head(top_10pct_count).sum()
        top_10pct_ratio = (top_10pct_sum / len(self.combined_df)) * 100
        
        print(f"\n상위 10% 성관({top_10pct_count}개)이 전체 급제자의 {top_10pct_ratio:.2f}% 차지")
        
        return bongwan_counts
    
    def analyze_seogwa_families(self, min_generations=2):
        """세과(世科) 가문 분석 - 동일 성관에서 연속 급제"""
        print(f"\n[2] 세과(世科) 가문 분석 (최소 {min_generations}대 연속)")
        print("-" * 60)
        
        # 성관별로 그룹화하여 시간순 정렬
        grouped = self.combined_df.groupby('성관')
        
        seogwa_families = []
        
        for name, group in grouped:
            if len(group) >= min_generations:
                # 시험년 기준으로 정렬
                sorted_group = group.sort_values('시험년_int')
                
                # 연속 급제 여부 확인 (세대 간격을 25-35년으로 가정)
                years = sorted_group['시험년_int'].dropna().values
                if len(years) >= min_generations:
                    consecutive = self._check_consecutive_generations(years)
                    if consecutive >= min_generations:
                        seogwa_families.append({
                            '성관': name,
                            '총급제자수': len(group),
                            '연속세대': consecutive,
                            '시작년도': int(years[0]),
                            '종료년도': int(years[-1]),
                            '기간': int(years[-1] - years[0])
                        })
        
        seogwa_df = pd.DataFrame(seogwa_families)
        if not seogwa_df.empty:
            seogwa_df = seogwa_df.sort_values('총급제자수', ascending=False)
            print(f"\n세과 가문 {len(seogwa_df)}개 발견")
            print(seogwa_df.head(20).to_string(index=False))
        else:
            print("세과 가문을 찾을 수 없습니다.")
        
        return seogwa_df
    
    def _check_consecutive_generations(self, years, gen_gap_min=20, gen_gap_max=40):
        """연속 세대 확인 (세대 간격 20-40년)"""
        if len(years) < 2:
            return 1
        
        consecutive = 1
        max_consecutive = 1
        
        for i in range(1, len(years)):
            gap = years[i] - years[i-1]
            if gen_gap_min <= gap <= gen_gap_max:
                consecutive += 1
                max_consecutive = max(max_consecutive, consecutive)
            else:
                consecutive = 1
        
        return max_consecutive
    
    def analyze_period_changes(self):
        """시대별 변화 분석"""
        print("\n[3] 시대별 급제 패턴 변화 분석")
        print("-" * 60)
        
        df = self.combined_df.copy()
        
        # 시대 구분
        def categorize_period(year):
            if pd.isna(year):
                return '미상'
            if year < 1494:  # 성종 25년
                return '조선 전기'
            elif year < 1608:  # 선조 41년
                return '조선 중기'
            else:
                return '조선 후기'
        
        df['시대'] = df['시험년_int'].apply(categorize_period)
        
        # 시대별 통계
        period_stats = df.groupby('시대').agg({
            '급제자': 'count',
            '성관': 'nunique'
        }).rename(columns={'급제자': '급제자수', '성관': '성관수'})
        
        # 시대별 집중도
        period_stats['평균급제자per성관'] = period_stats['급제자수'] / period_stats['성관수']
        
        print("\n시대별 통계:")
        print(period_stats)
        
        # 시대별 상위 성관
        print("\n시대별 상위 5개 성관:")
        for period in ['조선 전기', '조선 중기', '조선 후기']:
            period_data = df[df['시대'] == period]
            if not period_data.empty:
                print(f"\n{period}:")
                top_families = period_data['성관'].value_counts().head(5)
                for family, count in top_families.items():
                    print(f"  {family}: {count}명")
        
        return period_stats
    
    def analyze_geographic_distribution(self):
        """지역별 분포 분석"""
        print("\n[4] 거주지별 급제자 분포 분석")
        print("-" * 60)
        
        # 거주지 정보가 있는 데이터
        df = self.combined_df[self.combined_df['거주지'] != ''].copy()
        
        # 거주지별 통계
        geo_stats = df['거주지'].value_counts().head(20)
        
        print(f"\n상위 20개 거주지:")
        print(geo_stats)
        
        return geo_stats
    
    def generate_summary_report(self):
        """종합 분석 보고서 생성"""
        print("\n" + "=" * 60)
        print("혈연관계와 과거 급제 종합 분석 보고서")
        print("=" * 60)
        
        # 기본 통계
        print(f"\n총 문과 급제자 수: {len(self.combined_df)}명")
        print(f"총 성관 수: {self.combined_df['성관'].nunique()}개")
        print(f"평균 급제자/성관: {len(self.combined_df) / self.combined_df['성관'].nunique():.2f}명")
        
        # 각 분석 실행
        bongwan = self.analyze_bongwan_concentration()
        seogwa = self.analyze_seogwa_families(min_generations=3)
        period = self.analyze_period_changes()
        geo = self.analyze_geographic_distribution()
        
        print("\n" + "=" * 60)
        print("분석 완료")
        print("=" * 60)
        
        return {
            'bongwan': bongwan,
            'seogwa': seogwa,
            'period': period,
            'geo': geo
        }
    
    def visualize_results(self, results):
        """분석 결과 시각화"""
        print("\n분석 결과 시각화 중...")
        
        fig, axes = plt.subplots(2, 2, figsize=(16, 12))
        
        # 1. 상위 본관 분포
        ax1 = axes[0, 0]
        top_bongwan = results['bongwan'].head(15)
        ax1.barh(range(len(top_bongwan)), top_bongwan.values)
        ax1.set_yticks(range(len(top_bongwan)))
        ax1.set_yticklabels(top_bongwan.index)
        ax1.set_xlabel('급제자 수')
        ax1.set_title('상위 15개 성관별 급제자 수')
        ax1.invert_yaxis()
        
        # 2. 시대별 급제자 수
        ax2 = axes[0, 1]
        if 'period' in results and not results['period'].empty:
            period_data = results['period']['급제자수']
            ax2.bar(period_data.index, period_data.values)
            ax2.set_ylabel('급제자 수')
            ax2.set_title('시대별 급제자 수')
            ax2.tick_params(axis='x', rotation=45)
        
        # 3. 세과 가문 분포
        ax3 = axes[1, 0]
        if not results['seogwa'].empty:
            top_seogwa = results['seogwa'].head(10)
            ax3.barh(range(len(top_seogwa)), top_seogwa['총급제자수'].values)
            ax3.set_yticks(range(len(top_seogwa)))
            ax3.set_yticklabels(top_seogwa['성관'].values)
            ax3.set_xlabel('총 급제자 수')
            ax3.set_title('상위 10개 세과 가문')
            ax3.invert_yaxis()
        
        # 4. 지역별 분포
        ax4 = axes[1, 1]
        top_geo = results['geo'].head(10)
        ax4.bar(range(len(top_geo)), top_geo.values)
        ax4.set_xticks(range(len(top_geo)))
        ax4.set_xticklabels(top_geo.index, rotation=45, ha='right')
        ax4.set_ylabel('급제자 수')
        ax4.set_title('상위 10개 거주지별 급제자 수')
        
        plt.tight_layout()
        
        # 저장
        output_path = 'kinship_analysis_results.png'
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        print(f"시각화 결과 저장: {output_path}")
        
        return fig


def main():
    """메인 실행 함수"""
    print("조선시대 과거제 급제자 혈연관계 분석 프로그램")
    print("=" * 60)
    
    # 1단계: 데이터 파싱
    parser = KwagwaDataParser(".")
    data = parser.load_all_data()
    
    # 2단계: 혈연관계 분석
    analyzer = KinshipAnalyzer(data)
    results = analyzer.generate_summary_report()
    
    # 3단계: 시각화
    fig = analyzer.visualize_results(results)
    
    # 결과를 CSV로 저장
    print("\n결과를 CSV 파일로 저장 중...")
    
    if 'bongwan' in results:
        results['bongwan'].to_csv('본관별_급제자수.csv', encoding='utf-8-sig')
        print("  → 본관별_급제자수.csv 저장 완료")
    
    if not results['seogwa'].empty:
        results['seogwa'].to_csv('세과가문_분석.csv', encoding='utf-8-sig', index=False)
        print("  → 세과가문_분석.csv 저장 완료")
    
    if 'period' in results:
        results['period'].to_csv('시대별_통계.csv', encoding='utf-8-sig')
        print("  → 시대별_통계.csv 저장 완료")
    
    print("\n모든 분석 완료!")


if __name__ == "__main__":
    main()
