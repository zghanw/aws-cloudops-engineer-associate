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
- **Keep it current.** Don't make a deprecated feature or a service that is closed to new customers the right answer (for example, Performance Insights is now CloudWatch Database Insights, and Systems Manager Incident Manager no longer takes new customers).
- **Explain every option.** Each option gets its own rationale: why it's right, or which requirement it fails.

## Writing style

The questions follow the style of AWS's official practice questions, so practice here feels like the real exam.

**The scenario.** Two to five short, plain sentences in the present tense, such as "A company runs..." Put each constraint in its own sentence ("The company must...", "The company wants to... without..."). Use the exam's short service names, such as Amazon SNS and AWS KMS. Then a blank line, then the question on its own line.

**The question.** Short, with the qualifier in capitals: "What should a CloudOps engineer do FIRST?", "What is the MOST likely cause?", "Which solution will meet these requirements with the LEAST operational overhead?"

**The options.** This is where most practice tests go wrong.

- Multiple choice has exactly 4 options. Multiple response has 5 options with 2 correct, like the real exam.
- Write all options in the same form: all imperatives, all noun phrases, or all "A rule that..."
- Keep them about the same length. The right answer must not be the longest, the most detailed, or the most carefully hedged. `node check.js` fails the build if right answers stand out by length.
- Every wrong option should be a real action that fails one requirement in the scenario, for example one that is reactive instead of preventive, needs custom code when a managed feature exists, breaks least privilege, or doesn't work the way the option claims. No joke options.

**The rationales.** Two to four short sentences each. Say what the option does, tie it to the scenario, and finish with the verdict.

## Question format

Questions live in `data/d1.js` to `data/d5.js`, one file per exam domain:

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
