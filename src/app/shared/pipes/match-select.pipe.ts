import { Pipe, PipeTransform } from "@angular/core";
import { getProperty } from "../func";

@Pipe({
  name: "hightLightLabel",
})
export class SelectionHiLightPipe implements PipeTransform {
  transform(
    item: any,
    label: string | undefined,
    valueToMatch: string | null
  ): string {
    if (!item) {
      return "";
    }
    const lbl: string = String(getProperty(item, label) ?? "");
    return this.highlightMatchingPart(lbl, valueToMatch);
  }

  private highlightMatchingPart(entryString: string, toMatch: string) {
    if (entryString.length > 0 && toMatch?.length > 0) {
      const result = new RegExp(toMatch, "i").exec(entryString);
      if (result) {
        const startidx = result.index;
        const endIdx = startidx + toMatch.length;
        return `${entryString.slice(0, startidx)}<b>${entryString.slice(
          startidx,
          endIdx
        )}</b>${entryString.slice(endIdx)}`;
      }
    }
    return entryString;
  }
}
