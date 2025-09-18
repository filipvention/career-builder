import { CareerNote } from '../types';

export class AIService {
  public static async enhanceDescription(note: CareerNote): Promise<string> {
    const prompt = this.buildPrompt(note);
    return await this.callOpenAI(prompt);
  }

  private static async callOpenAI(prompt: string): Promise<string> {
    // In a real implementation, you would call OpenAI API here
    // For demo purposes, we'll simulate AI enhancement with predefined transformations
    return new Promise((resolve) => {
      setTimeout(() => {
        const enhanced = this.simulateAIEnhancement(prompt);
        resolve(enhanced);
      }, 2000); // Simulate API delay
    });
  }

  private static simulateAIEnhancement(description: string): string {
    // Simulate AI enhancement with pattern matching and improvements
    const enhancements = [
      {
        pattern: /I (did|made|created|built|worked on) (a|an|the)? ?(.+)/i,
        replacement: 'Successfully delivered $3, demonstrating strong technical execution and project management skills'
      },
      {
        pattern: /I (learned|studied|took) (.+)/i,
        replacement: 'Acquired expertise in $2, expanding technical capabilities and professional knowledge base'
      },
      {
        pattern: /I (helped|assisted|supported) (.+)/i,
        replacement: 'Provided strategic support for $2, contributing to team success and operational efficiency'
      },
      {
        pattern: /I (received|got) (.+) feedback/i,
        replacement: 'Earned recognition through $2 performance feedback, validating professional excellence and impact'
      },
      {
        pattern: /I (completed|finished) (.+)/i,
        replacement: 'Successfully completed $2, delivering measurable results and exceeding project expectations'
      }
    ];

    let enhanced = description;

    // Apply pattern-based enhancements
    for (const enhancement of enhancements) {
      if (enhancement.pattern.test(enhanced)) {
        enhanced = enhanced.replace(enhancement.pattern, enhancement.replacement);
        break;
      }
    }

    // If no pattern matched, apply general improvements
    if (enhanced === description) {
      enhanced = this.applyGeneralEnhancements(description);
    }

    // Add quantifiable impact when possible
    enhanced = this.addQuantifiableImpact(enhanced);

    return enhanced;
  }

  private static applyGeneralEnhancements(description: string): string {
    // Capitalize first letter and ensure professional tone
    let enhanced = description.charAt(0).toUpperCase() + description.slice(1);

    // Add professional framing
    if (!enhanced.includes('demonstrated') && !enhanced.includes('achieved') && !enhanced.includes('delivered')) {
      enhanced = `Demonstrated professional excellence through ${enhanced.toLowerCase()}`;
    }

    return enhanced;
  }

  private static addQuantifiableImpact(description: string): string {
    const impactPhrases = [
      'improving efficiency by 15%',
      'reducing processing time by 25%',
      'increasing team productivity by 20%',
      'enhancing user satisfaction by 30%',
      'streamlining workflows by 40%',
      'optimizing performance by 18%'
    ];

    // Randomly add quantifiable impact (in real implementation, this would be more intelligent)
    if (Math.random() > 0.5 && !description.includes('%')) {
      const randomImpact = impactPhrases[Math.floor(Math.random() * impactPhrases.length)];
      description += `, ${randomImpact}`;
    }

    return description;
  }

  private static buildPrompt(note: CareerNote): string {
    const typeContext = {
      achievement: 'professional achievement or recognition',
      project: 'project or initiative',
      feedback: 'performance feedback or testimonial',
      skill: 'skill development or certification'
    };

    return `Transform this ${typeContext[note.type]} description into a professional CV-style statement:

      Title: ${note.title}
      Description: ${note.description}
      
      Requirements:
      - Use action verbs and quantifiable results where possible
      - Make it concise and impactful
      - Focus on professional value and outcomes
      - Maintain accuracy while enhancing presentation
      - Use third-person perspective suitable for CV/resume`;
  }
}