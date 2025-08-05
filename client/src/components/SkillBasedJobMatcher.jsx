import React, { useState, useEffect, useCallback } from 'react';

const SkillBasedJobMatcher = ({ userSkills, availableJobs, onMatchedJobs }) => {
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const parseSkills = (skillsString) => {
    if (!skillsString) return [];
    return skillsString
      .split(',')
      .map(skill => skill.trim().toLowerCase())
      .filter(skill => skill.length > 0);
  };

  const calculateSkillMatch = (userSkillsArray, jobSkillsArray) => {
    if (!userSkillsArray || userSkillsArray.length === 0) return 0;
    if (!jobSkillsArray || jobSkillsArray.length === 0) return 0;

    const userSkillsLower = userSkillsArray.map(skill => skill.toLowerCase());
    const jobSkillsLower = jobSkillsArray.map(skill => skill.toLowerCase());

    let matchCount = 0;
    userSkillsLower.forEach(userSkill => {
      jobSkillsLower.forEach(jobSkill => {
        if (userSkill === jobSkill || 
            userSkill.includes(jobSkill) || 
            jobSkill.includes(userSkill)) {
          matchCount++;
        }
      });
    });

    const maxSkills = Math.max(userSkillsLower.length, jobSkillsLower.length);
    return maxSkills > 0 ? (matchCount / maxSkills) * 100 : 0;
  };

  const matchJobsWithSkills = useCallback(() => {
    if (!userSkills || !availableJobs || availableJobs.length === 0) {
      setMatchedJobs([]);
      return;
    }

    setLoading(true);

    const userSkillsArray = parseSkills(userSkills);

    const jobsWithScores = availableJobs.map(job => {
      const jobSkills = [];
      
      if (job.skills && Array.isArray(job.skills)) {
        jobSkills.push(...job.skills);
      }
      
      if (job.description) {
        const descriptionSkills = extractSkillsFromText(job.description);
        jobSkills.push(...descriptionSkills);
      }
      
      if (job.title) {
        const titleSkills = extractSkillsFromText(job.title);
        jobSkills.push(...titleSkills);
      }

      const uniqueJobSkills = [...new Set(jobSkills)];

      const matchScore = calculateSkillMatch(userSkillsArray, uniqueJobSkills);

      const matchedSkills = userSkillsArray.filter(userSkill =>
        uniqueJobSkills.some(jobSkill =>
          userSkill === jobSkill.toLowerCase() ||
          userSkill.includes(jobSkill.toLowerCase()) ||
          jobSkill.toLowerCase().includes(userSkill)
        )
      );

      return {
        ...job,
        matchScore: Math.round(matchScore),
        matchedSkills: matchedSkills,
        totalJobSkills: uniqueJobSkills.length,
        userSkillsCount: userSkillsArray.length
      };
    });

    const relevantJobs = jobsWithScores
      .filter(job => job.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    setMatchedJobs(relevantJobs);
    onMatchedJobs(relevantJobs);
    setLoading(false);
  }, [userSkills, availableJobs, onMatchedJobs]);

  const extractSkillsFromText = (text) => {
    if (!text) return [];

    const skillKeywords = [
      //PLANGUAGES
      'javascript', 'js', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
      'swift', 'kotlin', 'typescript', 'ts', 'scala', 'r', 'matlab', 'perl', 'html', 'css',
      'react', 'angular', 'vue', 'node.js', 'nodejs', 'express.js', 'expressjs', 'django', 
      'flask', 'laravel', 'spring', 'asp.net', 'aspnet', 'jquery', 'bootstrap', 'sass', 
      'less', 'webpack', 'babel', 'npm', 'yarn', 'next.js', 'nextjs', 'nuxt.js', 'nuxtjs',
      // DB
      'mysql', 'postgresql', 'postgres', 'mongodb', 'sqlite', 'oracle', 'sql server', 
      'sqlserver', 'redis', 'elasticsearch', 'dynamodb', 'firebase', 'cassandra',
      // Cloud
      'aws', 'amazon web services', 'azure', 'google cloud', 'gcp', 'docker', 'kubernetes', 
      'k8s', 'jenkins', 'git', 'github', 'gitlab', 'terraform', 'ansible', 'chef', 'puppet',
      // AI
      'machine learning', 'ml', 'deep learning', 'dl', 'tensorflow', 'pytorch', 'scikit-learn', 
      'scikitlearn', 'pandas', 'numpy', 'matplotlib', 'seaborn', 'jupyter', 'spark', 'hadoop',
      //Development
      'react native', 'reactnative', 'flutter', 'xamarin', 'ionic', 'cordova', 'android', 'ios',
      // Soft Skills
      'leadership', 'communication', 'teamwork', 'problem solving', 'problemsolving', 'analytical',
      'project management', 'projectmanagement', 'agile', 'scrum', 'kanban', 'customer service',
      // A SKILLS
      'ui/ux', 'ui', 'ux', 'figma', 'adobe photoshop', 'photoshop', 'illustrator', 'sketch', 
      'invision', 'wireframing', 'prototyping', 'user research', 'design thinking',
      // NON TECH
      'digital marketing', 'digitalmarketing', 'seo', 'sem', 'social media', 'socialmedia', 
      'content marketing', 'contentmarketing', 'email marketing', 'emailmarketing', 'analytics', 
      'google ads', 'googleads', 'facebook ads', 'facebookads'
    ];

    const textLower = text.toLowerCase();
    const foundSkills = [];

    skillKeywords.forEach(skill => {
      if (textLower.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });

    return foundSkills;
  };

  useEffect(() => {
    matchJobsWithSkills();
  }, [userSkills, availableJobs, matchJobsWithSkills]);

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getMatchText = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-3">🎯 Skill-Based Job Matcher</h3>
      
      {loading && (
        <div className="flex items-center space-x-2 text-blue-600 mb-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Matching jobs with your skills...</span>
        </div>
      )}

      {userSkills && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Your Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {parseSkills(userSkills).map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {matchedJobs.length > 0 && !loading && (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-3">
            <p>✅ Found {matchedJobs.length} jobs matching your skills</p>
            <p>• Sorted by relevance to your profile</p>
            <p>• Based on skill overlap analysis</p>
          </div>
          
          <div className="space-y-3">
            {matchedJobs.map((job, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{job.title}</h4>
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${getMatchColor(job.matchScore)}`}>
                    {getMatchText(job.matchScore)}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                
                <div className="text-xs text-gray-500 mb-2">
                  <span>Match Score: {job.matchScore}%</span>
                  <span className="mx-2">•</span>
                  <span>{job.matchedSkills.length} skills matched</span>
                </div>
                
                {job.matchedSkills.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1">Matched Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {job.matchedSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-800 px-1 py-0.5 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-500">
                  <p>• Job has {job.totalJobSkills} skills • You have {job.userSkillsCount} skills</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {matchedJobs.length === 0 && !loading && userSkills && (
        <div className="text-center py-8 text-gray-500">
          <p>No jobs found matching your skills.</p>
          <p className="text-sm">Try updating your skills or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default SkillBasedJobMatcher; 