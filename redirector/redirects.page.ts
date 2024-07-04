export const layout = "to.vto";
export default function*({ from }: Lume.Page) {
  for (const config of from) {
    yield config;
  }
}