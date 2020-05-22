import express, { Response, Request, NextFunction } from "express";
export const app = express();
import { createStripeCheckoutSession } from "./checkout";

// Converts the incoming body of all requests into json
app.use(express.json());

// Setting origin to true allows the api to be accessible from any url
import cors from "cors";
app.use(cors({ origin: true }));

app.post("/test", (req: Request, res: Response) => {
  const amount = req.body.amount;

  res.status(200).send({ with_tax: amount * 7 });
});

/**
 * Catch async errors when awaiting promises
 */
function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
}

/**
 * Checkouts
 */
app.post(
  "/checkouts/",
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createStripeCheckoutSession(body.line_items));
  })
);
