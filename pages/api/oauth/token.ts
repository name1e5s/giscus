import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '../../../lib/variables';
import { decodeState } from '../../../lib/oauth/state';

interface TokenRequest {
  session: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { session } = req.body as TokenRequest;
  if (!session) {
    res.status(400).json({ error: 'Unable to parse request body.' });
    return;
  }

  const { encryption_password } = env;
  let token: string;
  try {
    token = await decodeState(session, encryption_password);
  } catch (err) {
    res.status(503).json({ error: err.message });
    return;
  }

  res.status(200).json({ token });
};