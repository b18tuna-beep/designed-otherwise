# Crew: who does what, on which model

The main chat is the **showrunner**. It plans, makes judgment calls, talks to Michael, and dispatches crew. It does not do craft work itself and never reads big files it can hand to a crew member.
Each crew brief below is a specialist. Spawn it with the Agent tool, `model` as listed, and a prompt of the form:
"You are the <role> for Designed Otherwise. Read `docs/crew/<file>.md` and follow it for job <slug>. <one line of episode-specific direction>."

| Stage | Crew brief | Model |
|---|---|---|
| Topic pick, lineup, creative judgment, Michael's notes | showrunner (main chat) | Opus |
| Research dossier | `research.md` | Sonnet |
| Fact check (fresh agent, never the researcher) | `research.md` (check mode) | Sonnet |
| Visual treatment before storyboarding | `art-director.md` | Sonnet |
| Storyboard | `storyboard.md` | Sonnet |
| Music picks | `music.md` | Haiku |
| Render and assembly | `editor.md` | Sonnet |
| QA (fresh agent, never the editor) | `qa.md` | Sonnet |
| Titles and thumbnails (after the alpha cut) | `packaging.md` | Sonnet, showrunner picks the winner |
| Filing, status, catalogue, runs, metrics | `ops.md` | Haiku |

Independent stages (e.g. research for the next episode while this one renders) run in parallel, in the background.
These briefs are shared in spirit with Main Street Rewind (`mainstreetrewindchannel/channel-studio/docs/crew/`). A craft lesson that applies to both channels goes into both.

## Session protocol (saves the most usage)
Every message in a chat re-reads the whole chat, so long chats cost more per message and get less accurate. Rules:
1. **One chat per episode phase.** Phases: A topic+research+script, B look+storyboard, C render+QA, D packaging+release. A new chat starts at each of Michael's checkpoints.
2. At the end of every phase, or when the chat has been compacted, or after ~40 back-and-forths, the showrunner writes `HANDOFF.md` in the job folder (below) and commits it.
3. Every showrunner reply ends with a status footer: `DO · <slug> · phase <A-D> · chat: fresh | long | START NEW`. When it says START NEW, Michael opens a new chat in the project and types `DO next`.
4. `DO next` means: load the skill, read the backlog and the newest `HANDOFF.md`, and continue. Read nothing else until the task needs it.

## HANDOFF.md template (max 25 lines)
```
# <slug> handoff, <date>
Phase done: <A-D>   Next phase: <A-D>
Michael approved: <what, when>
Open decisions for Michael: <bullets or none>
Next 3 actions: <bullets>
Files that matter: <paths>
Gotchas learned this phase: <bullets, also copied into the right playbook>
```

## Usage rules for every agent
- Sparse/shallow clone (`--depth 1 --filter=blob:none --sparse`), check out only the folders needed.
- Never `cat` whole files or paste code, diffs or logs into chat; read the lines you need.
- Long runs go in the background; poll quietly.
- Crew return at most 10 lines. Details live in files.

Audience reminder: curious general audience, family friendly but not made for kids; unexpected design in everyday things; 9 to 10 min; hook first, soft landing, then intro.
