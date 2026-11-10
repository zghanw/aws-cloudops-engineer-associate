'use strict';
// Everything specific to this exam. app.js, check.js and style.css are the same file in every practice site.
{
  const guide = 'https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03.html';
  const link = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
  window.EXAM = {
    code: 'SOA-C03',
    name: 'AWS Certified CloudOps Engineer - Associate',
    key: 'soa', // localStorage prefix; index.html's theme script uses it too
    repo: 'https://github.com/zghanw/aws-cloudops-engineer-associate',
    guide,
    pass: 720,
    strip: 'Exam: 65 questions · 130 min · 720/1000 to pass',
    domains: {
      1: { name: 'Monitoring, Logging, Analysis, Remediation, and Performance Optimization', weight: 22 },
      2: { name: 'Reliability and Business Continuity', weight: 22 },
      3: { name: 'Deployment, Provisioning, and Automation', weight: 22 },
      4: { name: 'Security and Compliance', weight: 16 },
      5: { name: 'Networking and Content Delivery', weight: 18 },
    },
    // Real exam format: 65 questions (50 scored, 15 unscored) in 130 minutes. The mock scores all 65.
    mock: {
      count: 65, minutes: 130, title: 'Mock exam',
      note: `The format follows the ${link(guide, 'official exam guide')}. The real exam has 15 unscored questions mixed in; here all 65 count.`,
    },
    // Verified against the official SOA-C03 exam guide (version 1.2, 29 Oct 2026) and certification page, 2026-11-04.
    facts: `
      <li><b>Format:</b> 65 questions in 130 minutes, USD 150. 50 questions are scored and 15 are unscored, and you can't tell which is which.</li>
      <li>Question types: multiple choice (1 correct out of 4) and multiple response (2 or more correct out of 5 or more; you must pick all of them to get credit). There are no exam labs.</li>
      <li>Scaled score 100 to 1,000; <b>720 to pass</b>. Scoring is compensatory, so you don't need to pass each domain. There's no penalty for guessing, so answer every question.</li>
      <li>SOA-C03 replaced SOA-C02 (the SysOps Administrator exam) on 30 Sep 2025. The cost and performance domain was folded into Domain 1.</li>
      <li>The 2026 exam guide revisions added Amazon Bedrock, AWS DevOps Agent, AWS Security Agent, Kiro, and the AWS Health Dashboard to the in-scope services, and Amazon S3 Files to the skills. Guide changes reach the exam at least 1 month after they're published.</li>
      <li>Skill 3.1.6 names third-party tools such as Terraform. This site's questions use native AWS tools only, so read up on Terraform basics separately.</li>`,
    resources: `
      <li>${link(guide, 'SOA-C03 exam guide')}, including the in-scope and out-of-scope service lists</li>
      <li>${link('https://aws.amazon.com/certification/certified-cloudops-engineer-associate/', 'AWS Certified CloudOps Engineer - Associate certification page')}</li>
      <li>${link('https://skillbuilder.aws/category/exam-prep/cloudops-engineer-associate-SOA-C03', 'Exam prep plan on AWS Skill Builder')}, which includes the Official Practice Question Set (sign-in required)</li>`,
  };
}
