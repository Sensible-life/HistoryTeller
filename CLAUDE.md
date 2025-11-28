# HistoryTeller Project Context

## Project Overview
This is a scrollytelling website exploring the Joseon Dynasty's civil examination system (Gwageo, ��) and its inherent inequalities. This is a data analysis and design project combining historical research with interactive web storytelling.

## Team Composition
- **Designer**: 1 person (visual design, UX, data visualization)
- **Developer**: 1 person (frontend implementation, animations, interactions)

## Project Goals
Create an engaging, interactive web experience that educates users about the Joseon civil examination system while critically examining its accessibility and fairness through data-driven storytelling.

## Content Structure & Narrative Flow

### 1. Opening Question
**"How can we identify the right talent for a nation?"**
- Visual: Background filled with circles representing people
- Interaction: Hovering over circles reveals basic information
- Data shown: Intelligence/Character/Potential (numerical representation)
- Goal: Make users think about talent selection methods

### 2. Comparison of Selection Systems
Interactive visualization showing different governmental selection methods:
- **Random Selection **: Gray circles randomly turn blue
- **Election **: Some circles become candidates, others merge into them, largest becomes blue
- **Hereditary/Inheritance (��/8�)**: Blue circle at top, family tree branches downward
- **Recommendation **: Blue circles above pull select gray circles upward with lines
- **Purchase of Office **: Circles turn yellow when crossing a threshold line

### 3. Introduction to Gwageo
Historical background and context:
- Origins in Han Dynasty, institutionalized in Sui Dynasty
- Adopted across East Asia (Goryeo, Joseon, Vietnam, Japan)
- Purpose: Weaken hereditary aristocracy, promote meritocracy
- Focus on Joseon Dynasty implementation

### 4. Detailed Examination System Breakdown
Deep dive into how Gwageo actually worked, using historical records:

**Overview**
- Test categories
- Examination stages 
- Examination content (Four Books and Five Classics, Chakmun E8, Sibu ܀)
- After passing (Gapgwa/Eulgwa/Byeonggwa rankings, official appointments)

**Detailed aspects to cover:**
- Eligibility requirements
- Testing schedule and format
- Answer sheet preparation methods
- Grading criteria
- Additional examinations (Saengwon-gwa, Jinsa-gwa)
- announcement system

### 5. Interactive Chatbot Experience
**Critical Question: "Could a rural farmer really take this exam easily?"**
- Conversational interface exploring practical barriers
- Reveals hidden inequalities through dialogue
- Data-driven insights on access, preparation requirements, costs

### 6. Revealing the Imbalance
Data visualization showing:
- Geographic distribution of successful candidates
- Social class analysis
- Economic barriers
- Educational access disparities
- Pass rates by region/class

### 7. Reform Attempts
Historical efforts to address inequalities:
- Policy changes documented in historical records
- Effectiveness of reforms
- Lasting impact

## Tone & Style Guidelines

### Voice
- **Neutral and scholarly**: Present historical facts objectively
- **Archival feel**: Design should evoke historical document aesthetics
- **Analytical**: Data-driven conclusions rather than emotional appeals
- **Educational**: Clear explanations without oversimplification

### Visual Style
- Clean, archival aesthetic
- Muted, traditional Korean color palette
- Typography inspired by historical documents
- Smooth, purposeful animations tied to scroll position
- Data visualizations should be clear and accessible

## Technical Approach

### Recommended Stack
- **Scrollytelling**: Scrollama.js or GSAP ScrollTrigger
- **Data Visualization**: D3.js for circle animations and charts
- **Framework**: React/Vue/Svelte for component management
- **Styling**: Tailwind CSS or CSS modules
- **Chatbot**: Custom implementation or lightweight library

### Key Interactions
1. Circle hover states revealing individual data
2. Scroll-triggered animations for system comparisons
3. Smooth transitions between narrative sections
4. Interactive chatbot interface
5. Data filtering and exploration tools

## Data Sources
- Joseon Dynasty Annals
- Historical examination records
- Geographic and demographic data
- Pass rate statistics
- Economic data from the period

## Success Metrics
- Engaging narrative flow that maintains user attention
- Clear communication of complex historical systems
- Effective visualization of inequality data
- Accessible to general audiences while maintaining scholarly accuracy
- Responsive design across devices

## Development Notes
- Prioritize performance for smooth scroll animations
- Ensure accessibility (keyboard navigation, screen readers)
- Mobile-responsive design essential
- Progressive enhancement approach
- Consider lazy loading for data-heavy sections

## Key Messages
1. Meritocracy was the ideal, but implementation had systemic barriers
2. Geographic and economic factors heavily influenced access
3. The system evolved with various reform attempts
4. Historical parallels to modern selection systems exist

---

**When working on this project, Claude should:**
- Maintain historical accuracy with source citations
- Balance educational content with engaging interactivity
- Suggest data visualization approaches appropriate for each section
- Consider both designer and developer perspectives
- Recommend performance optimizations for scroll-heavy animations
- Propose accessibility improvements
- Keep the archival, scholarly tone consistent throughout