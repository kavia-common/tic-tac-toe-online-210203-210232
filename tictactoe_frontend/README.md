# Tic Tac Toe - Ocean Professional (Angular)

This Angular app implements a complete Tic Tac Toe game with a modern "Ocean Professional" theme, in-memory audit trail, and scaffolding for role-based access control and single-player mode.

## Features

- 3x3 board with turn indicator
- Win/draw detection; board locks after game over until restart
- Score tracking for X wins, O wins, and draws
- Restart control
- In-memory Audit Trail capturing:
  - ISO timestamp
  - userId (`playerX`, `playerO`, or `system`)
  - action (`MOVE`, `RESET`, `ERROR`)
  - metadata: index, boardBefore, boardAfter, reason (when reset)
- Ocean Professional theme:
  - Primary #2563EB, Secondary #F59E0B, Error #EF4444
  - Background #f9fafb, Surface #ffffff, Text #111827
  - Rounded corners, subtle gradients, soft shadows
- RBAC scaffolding:
  - `Role` enum (Player, Auditor)
  - Commented placeholders for future permission checks
- Single-player mode scaffold (UI button disabled, service stub present)

## Run

- Development server (already configured for port 3000 to match preview system):
  ```
  npm install
  npm start
  ```
  Open: http://localhost:3000

- Unit tests:
  ```
  npm test
  ```

## Code Structure

- `src/app/services/game.service.ts`: game state, validation, win/draw detection, scores, reset, audit logging, AI stub
- `src/app/services/audit.service.ts`: in-memory audit log
- `src/app/components/board/board.component.*`: 3x3 board UI
- `src/app/app.component.*`: page layout, scoreboard, controls, audit trail list
- `src/app/models/audit.models.ts`: AuditEntry, ActionType, Role

## Compliance Notes

- Audit trail captured contemporaneously in memory (persisted storage can be added later).
- Data Integrity (ALCOA+): entries are attributable, timestamped, legible, and accurate per UI actions.
- Error handling scaffolding: service catches and logs errors under `ActionType.ERROR`.
- Access Control: placeholders are present for RBAC checks before operations.

## Tests

`src/app/services/game.service.spec.ts` includes:
- Happy path: moves and turn switch
- Win detection and lockout
- Draw detection
- Invalid move validation
- Reset resets state and creates RESET audit entry
- MOVE audit entries include before/after snapshots

## Future Work

- Implement authentication and tie user identity to audit `userId`
- Enforce RBAC permissions based on `Role`
- Persist audit logs
- Implement computer opponent logic and enable Single Player mode
