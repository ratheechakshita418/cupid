const calculateMBTI = (responses) => {
  // Simplified MBTI calculation based on questionnaire responses
  // Map responses to MBTI dimensions
  const traits = {
    E: 0, // Extraversion
    I: 0,
    S: 0, // Sensing
    N: 0,
    T: 0, // Thinking
    F: 0,
    J: 0, // Judging
    P: 0,
  };

  // Scoring logic based on question categories and answers
  Object.entries(responses).forEach(([questionId, answer]) => {
    const qId = parseInt(questionId);
    switch (qId) {
      case 1: // Weekend preference
        if (answer === 'Outdoors adventure' || answer === 'Social events') traits.E += 2;
        else traits.I += 2;
        break;
      case 2: // Physical attraction
        if (answer === 'Very important') traits.S += 2;
        else traits.N += 2;
        break;
      case 3: // Career vs personal
        if (answer === 'Career focused') traits.T += 2;
        else traits.F += 2;
        break;
      case 4: // Conflict handling
        if (answer === 'Direct conversation') traits.E += 1;
        else traits.I += 1;
        break;
      case 5: // Humor
        if (answer === 'Essential') traits.E += 2;
        else traits.I += 2;
        break;
      case 6: // Long-term plans
        if (answer === 'Want marriage & kids') traits.J += 2;
        else traits.P += 2;
        break;
      case 7: // Going out
        if (answer === 'Every day' || answer === '3-4 times a week') traits.E += 2;
        else traits.I += 2;
        break;
      case 8: // Friendships
        if (answer === 'Many close friends') traits.E += 2;
        else traits.I += 2;
        break;
      case 9: // Spirituality
        if (answer === 'Very important') traits.F += 2;
        else traits.T += 2;
        break;
      case 10: // Relationship status
        if (answer === 'Looking for serious') traits.J += 2;
        else traits.P += 2;
        break;
      case 11: // Time spending
        if (answer === 'Work/career') traits.T += 1;
        else traits.F += 1;
        break;
      case 12: // Vacation
        if (answer === 'City exploration') traits.N += 2;
        else traits.S += 2;
        break;
    }
  });

  const mbti = [
    traits.E > traits.I ? 'E' : 'I',
    traits.S > traits.N ? 'S' : 'N',
    traits.T > traits.F ? 'T' : 'F',
    traits.J > traits.P ? 'J' : 'P',
  ].join('');

  return mbti;
};

const calculateCompatibility = (user1Personality, user2Personality) => {
  // Calculate personality compatibility score (0-100)
  const mbti1 = user1Personality.mbti;
  const mbti2 = user2Personality.mbti;

  // Simple compatibility matrix (simplified)
  const compatibilityMatrix = {
    'ENFP': { 'ENFP': 90, 'INFP': 85, 'ENFJ': 80, 'INFJ': 75, 'ENTP': 70, 'INTP': 65, 'ENTJ': 60, 'INTJ': 55 },
    // Add more mappings as needed, for now use a base score
  };

  const baseScore = compatibilityMatrix[mbti1]?.[mbti2] || 50;

  // Add randomness and trait similarity
  const traitSimilarity = Object.keys(user1Personality.traits).reduce((sum, trait) => {
    const diff = Math.abs(user1Personality.traits[trait] - user2Personality.traits[trait]);
    return sum + (100 - diff);
  }, 0) / 5;

  const score = (baseScore + traitSimilarity) / 2;
  return Math.round(Math.min(100, Math.max(0, score)));
};

const scoreBigFive = (responses) => {
  // Calculate Big Five personality traits (0-100 for each) based on responses
  let openness = 50, conscientiousness = 50, extraversion = 50, agreeableness = 50, neuroticism = 50;

  Object.entries(responses).forEach(([questionId, answer]) => {
    const qId = parseInt(questionId);
    switch (qId) {
      case 1: // Weekend
        if (answer === 'Cultural activities') openness += 20;
        if (answer === 'Outdoors adventure') extraversion += 15;
        break;
      case 2: // Attraction
        if (answer === 'Open-minded') openness += 15;
        break;
      case 3: // Priorities
        if (answer === 'Personal growth') openness += 10;
        if (answer === 'Career focused') conscientiousness += 15;
        break;
      case 4: // Conflict
        if (answer === 'Compromise') agreeableness += 15;
        if (answer === 'Direct conversation') extraversion += 10;
        break;
      case 5: // Humor
        if (answer === 'Essential') extraversion += 20;
        break;
      case 6: // Plans
        if (answer === 'Want marriage & kids') conscientiousness += 10;
        break;
      case 7: // Going out
        if (answer === 'Every day') extraversion += 20;
        break;
      case 8: // Friendships
        if (answer === 'Many close friends') extraversion += 15;
        break;
      case 9: // Spirituality
        if (answer === 'Very important') agreeableness += 10;
        break;
      case 10: // Status
        if (answer === 'Friendship first') agreeableness += 15;
        break;
      case 11: // Time
        if (answer === 'Hobbies') openness += 15;
        if (answer === 'Work/career') conscientiousness += 15;
        break;
      case 12: // Vacation
        if (answer === 'Nature adventure') openness += 20;
        break;
    }
  });

  return {
    openness: Math.min(100, Math.max(0, openness)),
    conscientiousness: Math.min(100, Math.max(0, conscientiousness)),
    extraversion: Math.min(100, Math.max(0, extraversion)),
    agreeableness: Math.min(100, Math.max(0, agreeableness)),
    neuroticism: Math.min(100, Math.max(0, neuroticism)), // Not directly scored, keep default
  };
};

module.exports = {
  calculateMBTI,
  calculateCompatibility,
  scoreBigFive,
};
