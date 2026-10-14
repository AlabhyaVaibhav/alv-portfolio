import { test } from "node:test";
import assert from "node:assert/strict";
import { projectSlug, pagedProjects, neighbours } from "../lib/projectPages.ts";
import { projects } from "../content/projects.ts";

test("slugs are lowercase, hyphenated and URL-safe", () => {
  assert.equal(projectSlug("How Your City Moves"), "how-your-city-moves");
  assert.equal(projectSlug("PMs Are Becoming Builders Again!"), "pms-are-becoming-builders-again");
  assert.equal(projectSlug("  Twine  "), "twine");
});

test("only projects with a case-study page get a route, each with a unique slug", () => {
  const paged = pagedProjects([{ name: "A", page: {} }, { name: "B" }, { name: "C", page: {} }]);
  assert.deepEqual(paged.map((p) => p.name), ["A", "C"]);
  const slugs = pagedProjects(projects).map((p) => projectSlug(p.name));
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
  assert.ok(slugs.length >= 1, "at least one case study page");
});

test("neighbours wrap around so every page has a next and previous", () => {
  const list = [{ name: "A" }, { name: "B" }, { name: "C" }];
  assert.deepEqual(neighbours(list, "a").map((p) => p?.name), ["C", "B"]);
  assert.deepEqual(neighbours(list, "c").map((p) => p?.name), ["B", "A"]);
  assert.deepEqual(neighbours([{ name: "A" }], "a"), [null, null], "a single page has no neighbours");
});
