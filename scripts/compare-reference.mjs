import fs from 'node:fs/promises';

const [beforeLabel = 'baseline', afterLabel = 'final'] = process.argv.slice(2);
if (
  ![beforeLabel, afterLabel].every((label) => /^[a-zA-Z0-9_-]+$/.test(label))
) {
  throw new Error(
    'Reference labels may only contain letters, numbers, hyphens and underscores.',
  );
}
const read = async (label) =>
  JSON.parse(
    await fs.readFile(`.artifacts/${label}/measurements.json`, 'utf8'),
  );
const before = await read(beforeLabel);
const after = await read(afterLabel);
const report = after.map((current) => {
  const previous = before.find(
    (item) => item.route === current.route && item.width === current.width,
  );
  if (!previous)
    throw new Error(
      `Missing reference for ${current.route} at ${current.width}px`,
    );
  const bytes = (item) =>
    item.resources.reduce((total, resource) => total + resource.bytes, 0);
  return {
    route: current.route,
    width: current.width,
    overflow: current.overflow,
    heightBefore: previous.height,
    heightAfter: current.height,
    sections: current.sections.map((section, index) => ({
      title: section.title,
      heightDelta: Math.round(section.height - previous.sections[index].height),
    })),
    transferredBefore: bytes(previous),
    transferredAfter: bytes(current),
    transferReductionPercent: Math.round(
      (1 - bytes(current) / bytes(previous)) * 100,
    ),
  };
});
await fs.writeFile(
  '.artifacts/comparison-summary.json',
  JSON.stringify(report, null, 2),
);
console.table(
  report
    .filter((item) => item.width === 1280)
    .map(
      ({
        route,
        heightBefore,
        heightAfter,
        overflow,
        transferReductionPercent,
      }) => ({
        route,
        heightBefore,
        heightAfter,
        overflow,
        transferReductionPercent,
      }),
    ),
);
