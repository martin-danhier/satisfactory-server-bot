import { config } from "./config";

import { z } from "zod";

const StateSchema = z.object({
    numConnectedPlayers: z.number(),
    isGameRunning: z.boolean(),
    totalGameDuration: z.number(),
    isGamePaused: z.boolean(),
    techTier: z.number(),
});

type State = z.infer<typeof StateSchema>

type StateCallbacks = {
    [K in keyof State]: (oldValue: State[K], newValue: State[K]) => void
}

const ReplySchema = z.object({
    data: z.object({
        serverGameState: StateSchema,
    }),
});

class SatisfactoryWatchdog {

    state: Partial<State> = {}
    callbacks: Partial<StateCallbacks> = {}

    updateField<F extends keyof (State), T extends State[F]>(field: F, newValue: T) {
        if (this.state[field] === undefined) {
            // Save but do not trigger change behavior
            this.state[field] = newValue;
            return false;
        }

        if (newValue !== this.state[field]) {

            if (this.callbacks[field]) {
                this.callbacks[field](this.state[field], newValue);
            }

            this.state[field] = newValue;
            return true;
        }
        return false;
    }

    async update() {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // FIXME

        try {
            const response = await fetch(config.SATISFACTORY_API_BASE, {
                headers: {
                    'Authorization': `Bearer ${config.SATISFACTORY_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: '{"function":"QueryServerState"}'
            });
            const newState = ReplySchema.parse(await response.json()).data.serverGameState;

            // Update
            for (let [field, newValue] of Object.entries(newState)) {
                const key = field as keyof (State)
                this.updateField(key, newValue);
            }

        } catch (e) {
            console.error(`Failed to update: ${e}`);
        }


    }
}

export default SatisfactoryWatchdog;