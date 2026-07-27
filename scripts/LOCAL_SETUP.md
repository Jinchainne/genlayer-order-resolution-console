# Local Setup

## Minimal local review

```bash
pip install pytest
npm install
pytest
```

## Real GenLayer follow-up

After this contract-first submission, the next practical steps are:

1. copy `.env.example` to `.env`
2. set your RPC and private key
3. run `npm run deploy:local`
4. copy the deployed address into `.env` as `POLICY_ORACLE_ADDRESS`
5. run `npm run demo:local`
6. record the transaction hashes and explorer links
7. attach those links back into the README and `docs/SUBMISSION.md` before final submission

## Suggested first demo policies

- contribution originality gate
- payout approval gate
- moderation review gate
- refund pre-check gate
