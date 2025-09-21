import { CareerNote } from '../types';
import { UserPreferencesService } from './userPreferences';
import Groq from "groq-sdk";
import { ChatCompletion } from "groq-sdk/resources/chat/completions";


export class AIService {
  public static async enhanceDescription(note: CareerNote): Promise<ChatCompletion> {
    const tone = UserPreferencesService.getTone();
    const prompt = this.buildPrompt(note, tone);
    return await this.callGroqAI(prompt);
  }

  private static async callGroqAI(prompt: string): Promise<ChatCompletion> {

    const groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const response = groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "openai/gpt-oss-20b",
    });

    return response;

    // In a real implementation, you would call OpenAI API here
    // For demo purposes, we'll simulate AI enhancement with predefined transformations


    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     const enhanced = this.simulateAIEnhancement(prompt);
    //     resolve(enhanced);
    //   }, 2000); // Simulate API delay
    // });
  }


  private static simulateAIEnhancement(description: string): string {
    const tone = UserPreferencesService.getTone();

    // Simulate AI enhancement with pattern matching and improvements
    const enhancements = this.getEnhancementsByTone(tone);

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
      enhanced = this.applyGeneralEnhancements(description, tone);
    }

    // Add quantifiable impact when possible
    enhanced = this.addQuantifiableImpact(enhanced, tone);

    return enhanced;
  }

  private static getEnhancementsByTone(tone: string) {
    const baseEnhancements = [
      {
        pattern: /I (did|made|created|built|worked on) (a|an|the)? ?(.+)/i,
        replacement: this.getToneSpecificReplacement(tone, 'achievement', '$3')
      },
      {
        pattern: /I (learned|studied|took) (.+)/i,
        replacement: this.getToneSpecificReplacement(tone, 'learning', '$2')
      },
      {
        pattern: /I (helped|assisted|supported) (.+)/i,
        replacement: this.getToneSpecificReplacement(tone, 'support', '$2')
      },
      {
        pattern: /I (received|got) (.+) feedback/i,
        replacement: this.getToneSpecificReplacement(tone, 'feedback', '$2')
      },
      {
        pattern: /I (completed|finished) (.+)/i,
        replacement: this.getToneSpecificReplacement(tone, 'completion', '$2')
      }
    ];

    return baseEnhancements;
  }

  private static getToneSpecificReplacement(tone: string, type: string, content: string): string {
    const replacements = {
      professional: {
        achievement: `Successfully delivered ${content}, demonstrating strong technical execution and project management skills`,
        learning: `Acquired expertise in ${content}, expanding technical capabilities and professional knowledge base`,
        support: `Provided strategic support for ${content}, contributing to team success and operational efficiency`,
        feedback: `Earned recognition through ${content} performance feedback, validating professional excellence and impact`,
        completion: `Successfully completed ${content}, delivering measurable results and exceeding project expectations`
      },
      friendly: {
        achievement: `Had the opportunity to work on ${content}, which was both challenging and rewarding`,
        learning: `Enjoyed learning about ${content}, which has really expanded my skill set and perspective`,
        support: `Was happy to help with ${content}, working closely with the team to achieve great results`,
        feedback: `Received some wonderful ${content} feedback, which was incredibly motivating and affirming`,
        completion: `Successfully wrapped up ${content}, feeling proud of what we accomplished together`
      },
      technical: {
        achievement: `Implemented and delivered ${content}, utilizing advanced technical methodologies and best practices`,
        learning: `Developed comprehensive expertise in ${content}, including theoretical foundations and practical applications`,
        support: `Provided technical guidance and implementation support for ${content}, optimizing system performance and reliability`,
        feedback: `Received detailed ${content} performance evaluation, confirming technical proficiency and architectural decision-making`,
        completion: `Executed and delivered ${content}, meeting all technical specifications and performance benchmarks`
      }
    };

    return replacements[tone as keyof typeof replacements]?.[type as keyof typeof replacements.professional] ||
      replacements.professional[type as keyof typeof replacements.professional];
  }

  private static applyGeneralEnhancements(description: string, tone: string): string {
    // Capitalize first letter and ensure professional tone
    let enhanced = description.charAt(0).toUpperCase() + description.slice(1);

    // Add tone-specific framing
    if (!enhanced.includes('demonstrated') && !enhanced.includes('achieved') && !enhanced.includes('delivered') && !enhanced.includes('worked') && !enhanced.includes('implemented')) {
      const framings = {
        professional: `Demonstrated professional excellence through ${enhanced.toLowerCase()}`,
        friendly: `Had a great experience working on ${enhanced.toLowerCase()}`,
        technical: `Implemented comprehensive solution involving ${enhanced.toLowerCase()}`
      };
      enhanced = framings[tone as keyof typeof framings] || framings.professional;
    }

    return enhanced;
  }

  private static addQuantifiableImpact(description: string, tone: string): string {
    const impactPhrases = {
      professional: [
        'improving efficiency by 15%',
        'reducing processing time by 25%',
        'increasing team productivity by 20%',
        'enhancing user satisfaction by 30%',
        'streamlining workflows by 40%',
        'optimizing performance by 18%'
      ],
      friendly: [
        'which helped the team work 15% more efficiently',
        'saving everyone about 25% of their time',
        'making the whole team 20% more productive',
        'leading to 30% happier users',
        'making our workflows 40% smoother',
        'boosting performance by 18%'
      ],
      technical: [
        'achieving 15% performance optimization',
        'reducing computational overhead by 25%',
        'increasing system throughput by 20%',
        'improving user experience metrics by 30%',
        'optimizing workflow automation by 40%',
        'enhancing system performance by 18%'
      ]
    };

    const phrases = impactPhrases[tone as keyof typeof impactPhrases] || impactPhrases.professional;

    // Randomly add quantifiable impact (in real implementation, this would be more intelligent)
    if (Math.random() > 0.5 && !description.includes('%')) {
      const randomImpact = phrases[Math.floor(Math.random() * phrases.length)];
      description += `, ${randomImpact}`;
    }

    return description;
  }

  private static buildPrompt(note: CareerNote, tone: string): string {
    const typeContext = {
      achievement: 'professional achievement or recognition',
      project: 'project or initiative',
      feedback: 'performance feedback or testimonial',
      skill: 'skill development or certification'
    };

    const toneInstructions = {
      professional: 'Use formal, professional language with action verbs and quantifiable results',
      friendly: 'Use warm, approachable language while maintaining professionalism',
      technical: 'Use precise technical language with detailed methodologies and specifications'
    };

    const toneInstruction = toneInstructions[tone as keyof typeof toneInstructions] || toneInstructions.professional;

    return `Transform this ${typeContext[note.type]} description into a professional CV-style statement:

      Title: ${note.title}
      Description: ${note.description}
      
      Requirements:
      - ${toneInstruction}
      - Include quantifiable results where possible
      - Make it concise and impactful
      - Focus on professional value and outcomes
      - Maintain accuracy while enhancing presentation
      - Use first-person perspective suitable for CV/resume`;
  }
}