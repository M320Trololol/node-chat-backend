import { Request, Response, Router } from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Hello, this is the node-chat-backend API');
});

export const rootController: Router = router;