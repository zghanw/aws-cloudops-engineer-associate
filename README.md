<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/logo-readme-dark.png">
  <img alt="SOA-C03 Practice logo" src="docs/logo-readme.png" width="200">
</picture>

# SOA-C03 Practice

Free practice questions and a timed mock exam for the **AWS Certified CloudOps Engineer - Associate (SOA-C03)** exam.<br>
325 original scenario questions, 65 for each domain, a rationale for every option, no signup, no ads.

**[Start practicing](https://zghanw.github.io/aws-cloudops-engineer-associate/)** · [Report a wrong answer](https://github.com/zghanw/aws-cloudops-engineer-associate/issues/new/choose) · [Contribute a question](CONTRIBUTING.md)

<a href="https://zghanw.github.io/aws-cloudops-engineer-associate/"><img alt="Live site" src="https://img.shields.io/website?url=https%3A%2F%2Fzghanw.github.io%2Faws-cloudops-engineer-associate%2F&label=live%20site&up_message=online&down_message=offline"></a>
<a href="https://github.com/zghanw/aws-cloudops-engineer-associate/actions/workflows/check.yml"><img alt="Question bank check" src="https://github.com/zghanw/aws-cloudops-engineer-associate/actions/workflows/check.yml/badge.svg"></a>
<a href="https://github.com/zghanw/aws-cloudops-engineer-associate/commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/zghanw/aws-cloudops-engineer-associate"></a>
<a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/github/license/zghanw/aws-cloudops-engineer-associate"></a>

<br><br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/screenshots/question-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="docs/screenshots/question-light.png">
  <img alt="A scenario question with the explanation shown after answering" src="docs/screenshots/question-light.png" width="760">
</picture>

</div>

## Why this exists

I value free education. I strongly believe that practice should be free for anyone who learns with their whole heart and is willing to take the time to learn and practice.

Good SOA-C03 practice material usually sits behind a paywall, and dumps of real exam questions teach you nothing (and break the AWS Certification Program Agreement). This site gives you 325 original questions built on the current exam guide, each with an explanation for every option, so you learn why an answer is right and why the others fall short. It's free, and it will stay free.

## What's inside

| Domain | Exam weight | Questions |
|---|---:|---:|
| 1. Monitoring, Logging, Analysis, Remediation, and Performance Optimization | 22% | 65 |
| 2. Reliability and Business Continuity | 22% | 65 |
| 3. Deployment, Provisioning, and Automation | 22% | 65 |
| 4. Security and Compliance | 16% | 65 |
| 5. Networking and Content Delivery | 18% | 65 |

- Practice one domain at a time. After each answer, every option shows why it's right or wrong.
- Take a mock exam in the real format: 65 questions in 130 minutes, split by the official domain weights.
- Get both multiple-choice and multiple-response questions, like the real exam.
- Build on the long-standing operations skills that make up most of the bank, with some questions on newer services the exam guide names: AWS DevOps Agent, Kiro, AWS Security Agent, Amazon S3 Files, and Amazon Bedrock monitoring.
- Review each result with your answer and the correct answer labeled.
- Come back to the questions you missed. They're saved in your browser.
- Use it on a phone or a laptop, in light or dark mode.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/screenshots/mock-dark.png">
    <img alt="Mock exam with a timer and a question navigator" src="docs/screenshots/mock-light.png" width="370">
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/screenshots/results-dark.png">
    <img alt="Results page with a score for each domain" src="docs/screenshots/results-light.png" width="370">
  </picture>
</p>

## How the questions are written

Every question is original and written against the public [SOA-C03 exam guide](https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03.html). None come from the real exam, paid courses, or dumps. Each one has a short operations scenario, a clear requirement, and options of similar length where every wrong answer is a plausible action that fails one requirement. The right answer is not the longest option, and `check.js` enforces that on every change.

The questions were drafted with AI help, then checked one by one against the exam guide and AWS documentation.

The wording follows AWS exam conventions. A recently launched feature is the right answer only where the exam guide names it, and the bank sticks to native AWS tools. It has no Terraform questions, even though Skill 3.1.6 of the guide names Terraform, so read up on its basics separately.

Question bank last reviewed: 9 November 2026, against exam guide version 1.2 (published 29 October 2026).

Think a question is wrong? [Open an issue](https://github.com/zghanw/aws-cloudops-engineer-associate/issues/new/choose) with the question ID shown above each question. You don't need to write any code.

## Official resources

- [SOA-C03 Exam Guide](https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03.html), including the in-scope and out-of-scope service lists
- [AWS Certified CloudOps Engineer - Associate](https://aws.amazon.com/certification/certified-cloudops-engineer-associate/)
- [Exam prep for SOA-C03](https://skillbuilder.aws/category/exam-prep/cloudops-engineer-associate-SOA-C03) on AWS Skill Builder, including the Official Practice Question Set

## Run it locally

It's a static site with no build step and no dependencies.

```sh
git clone https://github.com/zghanw/aws-cloudops-engineer-associate.git
cd aws-cloudops-engineer-associate
python -m http.server 8000
```

Then open http://localhost:8000. Run `node check.js` to validate the question bank. CI runs the same check on every push.

## Contributing

Questions live in `data/d1.js` to `data/d5.js`, one file per domain, and exam details such as the domain weights live in `exam.js`. [CONTRIBUTING.md](CONTRIBUTING.md) covers the format and the ground rules. To suggest a question or report a wrong one, use the [issue forms](https://github.com/zghanw/aws-cloudops-engineer-associate/issues/new/choose).

If this helped you prepare, a star helps other candidates find it.

## More free AWS practice

- [AIB-C01 Practice](https://zghanw.github.io/aws-ai-business-strategist/) for the AWS Certified AI Business Strategist exam: 340 questions and a timed mock exam, built the same way.

## Disclaimer

This is an unofficial study aid, not affiliated with or endorsed by Amazon Web Services. AWS and AWS Certified are trademarks of Amazon.com, Inc. or its affiliates.

## License

[MIT](LICENSE)
