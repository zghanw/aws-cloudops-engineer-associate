# Contributing

Thanks for helping other people pass SOA-C03. The most useful contributions are:

1. **Fixing a question.** Wrong answer, unclear wording, or a fact that has changed. AWS ships changes often, so this matters a lot.
2. **Adding a question** for an exam skill that has few questions.
3. **Reporting a bug** in the quiz itself.

You don't need to write code for the first two. Opening an issue is enough.

## Ground rules for questions

- **Never submit real exam questions.** Sharing live exam content breaks the AWS Certification Program Agreement. Write every question yourself.
- **Don't copy from paid practice tests, dumps, or courses.** Original wording only.
- **Tie it to the exam guide.** Each question should test a skill listed in the [official SOA-C03 exam guide](https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03.html), using services from its in-scope list. Link your source for any fact.
- **Test operational judgment, not trivia.** The real exam asks what a CloudOps engineer should configure, check, or fix. Avoid questions that only test a number or a name.
- **Test the standard answer first.** Make a recently launched feature the right answer only if the exam guide names it. Otherwise, test the long-standing approach and mention the newer option in the rationale. Don't add a condition whose only purpose is to rule out the standard answer.
- **Keep it current.** Don't make a deprecated feature or a service that is closed to new customers the right answer (for example, Performance Insights is now CloudWatch Database Insights, and Systems Manager Incident Manager no longer takes new customers).
- **Explain every option.** Each option gets its own rationale: why it's right, or which requirement it fails.

## Writing style

Questions use the exam's format: a short scenario, a clear requirement, and plausible options. AWS's Official Practice Question Set is a good reference for the style.

**The scenario.** Two to five short, plain sentences in the present tense, usually starting "A company runs..." or "A company has..." Put each constraint in its own sentence ("The company must...", "The company needs to..."). Use the exam's service names on first mention, such as Amazon SNS and AWS KMS, and the short form after that. Write "a CloudOps engineer" until the scenario has introduced one, then "the CloudOps engineer". Then a blank line, then the question on its own line.

**The question.** Short, with the qualifier in capitals. Prefer the standard forms: "Which solution will meet these requirements?", "What should a CloudOps engineer do to meet this requirement?", "What should a CloudOps engineer do to resolve this issue?", "What is the MOST likely cause of this issue?", "Which solution will meet these requirements with the LEAST operational overhead?", "Which combination of steps will meet these requirements? (Select TWO.)"

**The options.** This is where most practice tests go wrong.

- Multiple choice has exactly 4 options. Multiple response has 5 options with 2 correct, like the real exam.
- Test native AWS features first. Make a third-party tool, such as Terraform, the answer only for the skills where the exam guide names it.
- Write all options in the same form: all imperatives, all noun phrases, or all "A rule that..." Split multi-step actions into sentences ("Create a rule. Add a target."), and use "to" for a purpose instead of "so that".
- Keep them about the same length. The right answer must not be the longest, the most detailed, or the most carefully hedged. `node check.js` fails the build if right answers stand out by length.
- Every wrong option should be a real action that fails one requirement in the scenario, for example one that is reactive instead of preventive, needs custom code when a managed feature exists, breaks least privilege, or doesn't work the way the option claims. No joke options.

**The rationales.** Two to four short sentences each. Say what the option does, tie it to the scenario, and finish with the verdict.

## Question format

Questions live in `data/d1.js` to `data/d5.js`, one file per exam domain. Exam details such as the domain names and weights live in `exam.js`, and `app.js`, `check.js` and `style.css` are shared with the other practice sites.

```js
{ id: "d2-66", d: 2,
  q: "Scenario sentences.\n\nWhich solution will meet these requirements?",
  o: ["Option", "Option", "Option", "Option"],
  a: [1],
  r: ["Why option 1 is wrong.", "Why option 2 is right.", "Why option 3 is wrong.", "Why option 4 is wrong."] },
```

- `id` is the domain prefix plus the next free number.
- `q` is the scenario, a blank line (`\n\n`), then the question. For multiple response, end the question with `(Select TWO.)`.
- `a` holds the index (from 0) of each correct option.
- `r` holds one rationale per option, in the same order as `o`.
- Options are shuffled when shown, so never write "option A" in a rationale.
- Use commas, colons or parentheses instead of dashes.

## Before opening a pull request

Run the data check. It needs Node.js and nothing else:

```bash
node check.js
```

It catches duplicate IDs, bad answer indexes, the wrong number of options, missing rationales, a missing `(Select TWO.)` tag, dashes, and answer-length bias. CI runs the same check on every pull request.

To try the site locally, serve the folder with any static server, for example `python -m http.server`, and open http://localhost:8000.
