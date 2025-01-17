/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */
/* eslint-disable no-undef */

"use strict";

// To disable all Web Replay tests, see browser.ini

// Test ending a recording at a breakpoint and then separately replaying to the end.
add_task(async function() {
  waitForExplicitFinish();

  const recordingFile = newRecordingFile();
  const recordingTab = BrowserTestUtils.addTab(gBrowser, null, { recordExecution: "*" });
  gBrowser.selectedTab = recordingTab;
  openTrustedLinkIn(EXAMPLE_URL + "doc_rr_continuous.html", "current");

  let toolbox = await attachDebugger(recordingTab), client = toolbox.threadClient;
  await client.interrupt();
  let bp = await setBreakpoint(client, "doc_rr_continuous.html", 14);
  await resumeToLine(client, 14);
  await resumeToLine(client, 14);
  await reverseStepOverToLine(client, 13);
  const lastNumberValue = await evaluateInTopFrame(client, "number");

  const tabParent = recordingTab.linkedBrowser.frameLoader.tabParent;
  ok(tabParent, "Found recording tab parent");
  ok(tabParent.saveRecording(recordingFile), "Saved recording");
  await once(Services.ppmm, "SaveRecordingFinished");

  await client.removeBreakpoint(bp);
  await toolbox.destroy();
  await gBrowser.removeTab(recordingTab);

  const replayingTab = BrowserTestUtils.addTab(gBrowser, null,
                                               { replayExecution: recordingFile });
  gBrowser.selectedTab = replayingTab;
  await once(Services.ppmm, "HitRecordingEndpoint");

  toolbox = await attachDebugger(replayingTab);
  client = toolbox.threadClient;
  await client.interrupt();
  await checkEvaluateInTopFrame(client, "number", lastNumberValue);
  await reverseStepOverToLine(client, 13);
  bp = await setBreakpoint(client, "doc_rr_continuous.html", 14);
  await rewindToLine(client, 14);
  await checkEvaluateInTopFrame(client, "number", lastNumberValue - 1);
  await resumeToLine(client, 14);
  await checkEvaluateInTopFrame(client, "number", lastNumberValue);

  await client.removeBreakpoint(bp);
  await toolbox.destroy();
  await gBrowser.removeTab(replayingTab);
});
