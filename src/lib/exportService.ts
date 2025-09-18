import { CareerNote, ExportOptions } from '../types';

export class ExportService {
  public static async generateExport(notes: CareerNote[], options: ExportOptions): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    switch (options.type) {
      case 'cv':
        return this.generateCVSection(notes);
      case 'linkedin':
        return this.generateLinkedInPost(notes, options.tone || 'neutral');
      case 'promotion':
        return this.generatePromotionCase(notes);
      default:
        throw new Error('Invalid export type');
    }
  }

  private static generateCVSection(notes: CareerNote[]): string {
    const sections = {
      achievement: 'Key Achievements',
      project: 'Notable Projects',
      skill: 'Technical Competencies',
      feedback: 'Recognition & Feedback'
    };

    let cvContent = '';
    
    // Group notes by type
    const groupedNotes = notes.reduce((acc, note) => {
      if (!acc[note.type]) acc[note.type] = [];
      acc[note.type].push(note);
      return acc;
    }, {} as Record<string, CareerNote[]>);

    // Generate sections
    Object.entries(groupedNotes).forEach(([type, typeNotes]) => {
      if (typeNotes.length > 0) {
        cvContent += `${sections[type as keyof typeof sections]}:\n`;
        typeNotes.forEach(note => {
          const description = note.ai_enhanced_description || note.description;
          cvContent += `• ${description}\n`;
        });
        cvContent += '\n';
      }
    });

    // Add summary if multiple types
    if (Object.keys(groupedNotes).length > 1) {
      const summary = this.generateProfessionalSummary(notes);
      cvContent = `Professional Summary:\n${summary}\n\n${cvContent}`;
    }

    return cvContent.trim();
  }

  private static generateLinkedInPost(notes: CareerNote[], tone: string): string {
    const toneStyles = {
      neutral: {
        opener: "Reflecting on recent professional milestones:",
        connector: "This experience reinforced",
        closer: "Looking forward to applying these insights in future challenges."
      },
      inspiring: {
        opener: "🚀 Excited to share some recent wins and learnings:",
        connector: "This journey taught me that",
        closer: "Here's to continuous growth and pushing boundaries! 💪"
      },
      technical: {
        opener: "Technical update on recent projects and achievements:",
        connector: "Key technical insights gained:",
        closer: "Always learning and evolving in the tech space."
      }
    };

    const style = toneStyles[tone as keyof typeof toneStyles];
    
    let post = `${style.opener}\n\n`;
    
    // Add key highlights
    const highlights = notes.slice(0, 3).map(note => {
      const description = note.ai_enhanced_description || note.description;
      return `✓ ${description}`;
    }).join('\n');
    
    post += `${highlights}\n\n`;
    
    // Add reflection
    const skills = notes.filter(n => n.type === 'skill').map(n => n.title);
    if (skills.length > 0) {
      post += `${style.connector} ${skills.slice(0, 2).join(' and ')} ${skills.length > 2 ? 'and other key skills' : ''} are essential for driving impact.\n\n`;
    }
    
    post += style.closer;
    
    // Add hashtags based on tone
    if (tone === 'inspiring') {
      post += '\n\n#Growth #Achievement #ProfessionalDevelopment #Success';
    } else if (tone === 'technical') {
      post += '\n\n#TechUpdate #Development #Innovation #TechnicalGrowth';
    } else {
      post += '\n\n#ProfessionalUpdate #CareerDevelopment #Milestones';
    }
    
    return post;
  }

  private static generatePromotionCase(notes: CareerNote[]): string {
    let promotionCase = 'PROMOTION CASE SUMMARY\n';
    promotionCase += '=' .repeat(50) + '\n\n';
    
    // Executive Summary
    promotionCase += 'EXECUTIVE SUMMARY:\n';
    promotionCase += this.generateExecutiveSummary(notes) + '\n\n';
    
    // Key Achievements
    const achievements = notes.filter(n => n.type === 'achievement');
    if (achievements.length > 0) {
      promotionCase += 'KEY ACHIEVEMENTS:\n';
      achievements.forEach((note, index) => {
        const description = note.ai_enhanced_description || note.description;
        promotionCase += `${index + 1}. ${description}\n`;
      });
      promotionCase += '\n';
    }
    
    // Project Impact
    const projects = notes.filter(n => n.type === 'project');
    if (projects.length > 0) {
      promotionCase += 'PROJECT IMPACT:\n';
      projects.forEach((note, index) => {
        const description = note.ai_enhanced_description || note.description;
        promotionCase += `${index + 1}. ${description}\n`;
      });
      promotionCase += '\n';
    }
    
    // Performance Feedback
    const feedback = notes.filter(n => n.type === 'feedback');
    if (feedback.length > 0) {
      promotionCase += 'PERFORMANCE RECOGNITION:\n';
      feedback.forEach((note, index) => {
        const description = note.ai_enhanced_description || note.description;
        promotionCase += `${index + 1}. ${description}\n`;
      });
      promotionCase += '\n';
    }
    
    // Skills Development
    const skills = notes.filter(n => n.type === 'skill');
    if (skills.length > 0) {
      promotionCase += 'PROFESSIONAL DEVELOPMENT:\n';
      skills.forEach((note, index) => {
        const description = note.ai_enhanced_description || note.description;
        promotionCase += `${index + 1}. ${description}\n`;
      });
      promotionCase += '\n';
    }
    
    // Recommendation
    promotionCase += 'RECOMMENDATION:\n';
    promotionCase += 'Based on the documented achievements, project impact, and consistent performance recognition, ';
    promotionCase += 'I recommend advancement to the next level. The demonstrated capabilities align with ';
    promotionCase += 'senior-level responsibilities and show readiness for increased scope and leadership opportunities.';
    
    return promotionCase;
  }

  private static generateProfessionalSummary(notes: CareerNote[]): string {
    const achievements = notes.filter(n => n.type === 'achievement').length;
    const projects = notes.filter(n => n.type === 'project').length;
    const skills = notes.filter(n => n.type === 'skill').length;
    
    let summary = 'Results-driven professional with demonstrated expertise across ';
    
    const areas = [];
    if (projects > 0) areas.push('project delivery');
    if (achievements > 0) areas.push('performance excellence');
    if (skills > 0) areas.push('technical development');
    
    summary += areas.join(', ') + '. ';
    summary += `Proven track record of ${achievements + projects} documented accomplishments `;
    summary += 'with quantifiable impact and consistent recognition for quality delivery.';
    
    return summary;
  }

  private static generateExecutiveSummary(notes: CareerNote[]): string {
    const totalNotes = notes.length;
    const achievements = notes.filter(n => n.type === 'achievement').length;
    const projects = notes.filter(n => n.type === 'project').length;
    
    let summary = `This promotion case is based on ${totalNotes} documented career milestones, including `;
    summary += `${achievements} key achievements and ${projects} significant project contributions. `;
    summary += 'The evidence demonstrates consistent high performance, measurable impact, and readiness ';
    summary += 'for increased responsibilities and leadership opportunities.';
    
    return summary;
  }
}