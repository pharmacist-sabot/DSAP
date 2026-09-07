# Drug Safety Assessment Platform

```
██████╗  ██████╗ █████╗ ██████╗
██╔══██╗██╔════╝██╔══██╗██╔══██╗
██║  ██║███████╗███████║██████╔╝
██║  ██║╚════██║██╔══██║██╔═══╝
██████╔╝██████╔╝██║  ██║██║
╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝
```

---

## ◆ PULSE

A hospital cannot improve what it has not measured. DSAP walks a
pharmacy through the 2022 medication safety standards - 15 standards
across four dimensions: Management, Service, System, and Supply Chain -
and scores every step with a waterfall rule: level 2 is not reachable
until level 1 is honestly completed. The assessment is config-driven,
the progress survives the refresh, and the level shown is the level
earned.

| Management ▣ | Service ▣ | System ▣ | Supply Chain ▣ |
|---|---|---|---|

*The four dimensions, the waterfall scoring, and the persistent
assessment are sealed.*

> Built with Vue 3 + TypeScript + Pinia, styled by Tailwind CSS v4,
> scored by a waterfall the criteria cannot skip.
>
> **suradet-ps**, artifact keeper

---

## ◆ IGNITION

One runtime, two commands.

```
⟫ git clone https://github.com/suradet-ps/dsap.git
⟫ cd dsap
⟫ bun install
⟫ bun dev
```

Open [http://localhost:5173](http://localhost:5173).

```
⟫ bun lint          # Biome, strict mode
⟫ bun lint:fix
```

<details>
<summary>Prerequisites</summary>

- Node.js (LTS recommended)
- [Bun](https://bun.sh/) - the package manager

</details>

---

## ◆ ANATOMY

One brain, one rule, a handful of honest states.

- **Configures** - every criterion in the app comes from
  `src/data/standards.json`: 15 standards, each with levels 0-5 of
  criteria. The UI is generated, never hand-written per row - change the
  config, change the assessment.
- **Scores** - the waterfall logic in the Pinia store computes achieved
  levels: a higher level stands only on completed lower ones. No
  shortcuts, no skipped floors.
- **Persists** - progress auto-saves to `LocalStorage` through Pinia and
  VueUse (`useStorage`), so a pharmacist's afternoon work survives the
  browser and the day.
- **Renders** - Tailwind CSS v4 styles the sidebar layout and the
  level cards; the domain components (`LevelCard`, `StandardNav`) and
  common atoms (`BaseButton`, `BaseDialog`) stay cleanly separated for
  maintenance.
- **Types** - the whole model is strict TypeScript: `Standard`,
  `StandardLevel`, `EvaluationCriterion`, `HospitalInfo`. What the store
  scores is what the types say.

---

## ◆ RITUALS

**The core ceremony** - one assessment, one honest walk:

1. Open the assessment. The sidebar lists the 15 standards across the
   four dimensions.
2. Work a standard level by level: tick the criteria that are true.
   The waterfall holds - nothing above a floor that is not finished.
3. Leave mid-way. Progress was saved the moment it happened; the
   refresh changes nothing.
4. Return and continue. The level shown is the level earned, no more.

**The ceremony of the waterfall** - level 2 waits for level 1, level 3
waits for level 2. The scoring refuses to flatter, and a partially
completed floor reads as exactly that.

**The ceremony of the config** - standards change; the app does not
need to. When the 2022 criteria evolve, the edit happens in
`standards.json`, not in component code.

---

## ◆ ECHOES

**Where this artifact is heading**

```
config   ▸ standards.json drives every criterion ─────────────────── ▸ sealed
scoring  ▸ waterfall logic, levels 0-5 ───────────────────────────── ▸ sealed
persist  ▸ LocalStorage auto-save via Pinia + VueUse ─────────────── ▸ sealed
```

**Raising the artifact** - the bar is Biome strict mode plus the test
suite under `tests/` (Vitest). Open an issue first to discuss a change.

**Status** - every push is gated by the [CI workflow](.github/workflows)
on the way to Vercel.

---

```
  ─────────────────────────────────────────
   A level not honestly earned
   is a safety gap with a nice label.
  ─────────────────────────────────────────
```

Licensed under the [MIT License](LICENSE).
