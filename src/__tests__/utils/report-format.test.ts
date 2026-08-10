import { describe, expect, it } from "vitest";

import {
  buildReportFilename,
  formatPdfMoney,
  formatPdfNumber,
  getPdfCurrencyLabel,
  isReportFormat,
  REPORT_MIME_TYPES,
  slugifyReportTitle,
} from "@/utils/reports/report-format";
import type { ReportRange } from "@/utils/reports/report-range";

const RANGE: ReportRange = {
  preset: "custom",
  from: "2026-01-01",
  to: "2026-08-10",
};

describe("isReportFormat", () => {
  it("accepts the three supported formats only", () => {
    expect(isReportFormat("pdf")).toBe(true);
    expect(isReportFormat("xlsx")).toBe(true);
    expect(isReportFormat("csv")).toBe(true);
    expect(isReportFormat("xls")).toBe(false);
    expect(isReportFormat("")).toBe(false);
  });
});

describe("REPORT_MIME_TYPES", () => {
  it("declares the charset on CSV, which is otherwise guessed", () => {
    expect(REPORT_MIME_TYPES.csv).toContain("charset=utf-8");
  });
});

describe("slugifyReportTitle", () => {
  it("lowercases and hyphenates", () => {
    expect(slugifyReportTitle("2024 Honda City", "vehicle")).toBe("2024-honda-city");
  });

  it("collapses runs of punctuation and trims the edges", () => {
    expect(slugifyReportTitle("  My Car!! (daily) ", "vehicle")).toBe("my-car-daily");
  });

  it("strips anything that could escape a header or a path", () => {
    // The allowlist is the guard: nothing outside [a-z0-9-] survives, so a
    // quote, a newline or a traversal sequence cannot reach the filename.
    expect(slugifyReportTitle('../../etc/passwd', "vehicle")).toBe("etc-passwd");
    expect(slugifyReportTitle('a"; rm -rf /', "vehicle")).toBe("a-rm-rf");
    expect(slugifyReportTitle("line\nbreak", "vehicle")).toBe("line-break");
  });

  it("falls back to the scope when nothing Latin survives", () => {
    expect(slugifyReportTitle("मेरी गाड़ी", "vehicle")).toBe("vehicle");
    expect(slugifyReportTitle("", "garage")).toBe("garage");
  });

  it("caps the length without leaving a trailing hyphen", () => {
    const slug = slugifyReportTitle("a".repeat(60), "vehicle");

    expect(slug).toHaveLength(48);
    expect(slug.endsWith("-")).toBe(false);
  });
});

describe("buildReportFilename", () => {
  it("names the vehicle and the window it covers", () => {
    expect(
      buildReportFilename({ title: "2024 Honda City", scope: "vehicle", range: RANGE }, "pdf"),
    ).toBe("veloce-2024-honda-city-2026-01-01-to-2026-08-10.pdf");
  });

  it("uses the requested extension", () => {
    expect(
      buildReportFilename({ title: "Your Garage", scope: "garage", range: RANGE }, "xlsx"),
    ).toBe("veloce-your-garage-2026-01-01-to-2026-08-10.xlsx");
  });
});

describe("getPdfCurrencyLabel", () => {
  it("falls back to the ISO code for the rupee", () => {
    // The standard PDF fonts carry WinAnsi, which predates U+20B9 — the glyph
    // renders as nothing, so every amount would lose its currency.
    expect(getPdfCurrencyLabel("INR")).toBe("INR");
    expect(getPdfCurrencyLabel("₹")).toBe("INR");
  });

  it("keeps the symbols Helvetica can actually draw", () => {
    expect(getPdfCurrencyLabel("USD")).toBe("$");
    expect(getPdfCurrencyLabel("GBP")).toBe("£");
    expect(getPdfCurrencyLabel("EUR")).toBe("€");
    expect(getPdfCurrencyLabel("JPY")).toBe("¥");
  });

  it("falls back for anything it cannot vouch for", () => {
    expect(getPdfCurrencyLabel("AUD")).toBe("AUD");
  });
});

describe("formatPdfMoney", () => {
  it("gives a code room to breathe and keeps a symbol tight", () => {
    expect(formatPdfMoney(1_200.5, "INR")).toBe("INR 1,200.50");
    expect(formatPdfMoney(1_200.5, "USD")).toBe("$1,200.50");
  });

  it("always shows both decimal places", () => {
    expect(formatPdfMoney(1_200, "USD")).toBe("$1,200.00");
  });
});

describe("formatPdfNumber", () => {
  it("pins grouping so the same report reads the same on any server", () => {
    expect(formatPdfNumber(1_234_567)).toBe("1,234,567");
  });

  it("honours a requested precision", () => {
    expect(formatPdfNumber(14.27, { maximumFractionDigits: 1 })).toBe("14.3");
  });
});
