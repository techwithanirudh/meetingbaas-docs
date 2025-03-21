import { readFile, writeFile } from "fs/promises";
import { glob } from "glob";

const linkMappings = {
  // Transcript seeker section
  "/docs/concepts/api/authentication":
    "/docs/transcript-seeker/concepts/api/authentication",
  "/docs/concepts/api/database":
    "/docs/transcript-seeker/concepts/api/database",
  "/docs/concepts/environment-variables":
    "/docs/transcript-seeker/concepts/environment-variables",
  "/docs/getting-started/installation":
    "/docs/transcript-seeker/getting-started/installation",
  "/docs/guides/turso": "/docs/transcript-seeker/guides/turso",

  // Speaking bots section
  "/docs/speaking-bots/command-line": "/docs/speaking-bots/command-line",
  "/docs/speaking-bots/getting-started/ngrok-setup":
    "/docs/speaking-bots/getting-started/ngrok-setup",
  "/docs/speaking-bots/getting-started/environment-variables":
    "/docs/speaking-bots/getting-started/environment-variables",

  // API section - fixing reference paths
  "/docs/api/reference/join": "/docs/api/reference/join",
  "/docs/api/reference/list_events":
    "/docs/api/reference/calendars/list_events",
  "/docs/api/reference/resync_all_calendars":
    "/docs/api/reference/calendars/resync_all_calendars",
  "/docs/api/reference/create_calendar":
    "/docs/api/reference/calendars/create_calendar",
  "/docs/api/reference/get_event": "/docs/api/reference/calendars/get_event",
  "/docs/api/reference/schedule_record_event":
    "/docs/api/reference/calendars/schedule_record_event",
  "/docs/api/reference/unschedule_record_event":
    "/docs/api/reference/calendars/unschedule_record_event",
  "/docs/api/reference/retranscribe_bot":
    "/docs/api/reference/retranscribe_bot",

  // Calendar section
  "/docs/api/getting-started/calendars/setup":
    "/docs/api/getting-started/calendars/setup",
  "/docs/api/getting-started/calendars/events":
    "/docs/api/getting-started/calendars/events",
  "/docs/api/getting-started/calendars/webhooks":
    "/docs/api/getting-started/calendars/webhooks",
  "/docs/api/getting-started/calendars/maintenance":
    "/docs/api/getting-started/calendars/maintenance",
  "/docs/api/getting-started/sending-a-bot":
    "/docs/api/getting-started/sending-a-bot",
  "/docs/api/getting-started/getting-the-data":
    "/docs/api/getting-started/getting-the-data",
  "/docs/api/getting-started/removing-a-bot":
    "/docs/api/getting-started/removing-a-bot",
  "/docs/api/getting-started/community-support":
    "/docs/api/community-and-support",
};

async function fixLinks() {
  const files = await glob("content/**/*.mdx");

  for (const file of files) {
    let content = await readFile(file, "utf-8");
    let hasChanges = false;

    for (const [oldLink, newLink] of Object.entries(linkMappings)) {
      if (content.includes(oldLink)) {
        content = content.replace(
          new RegExp(oldLink.replace(/\//g, "\\/"), "g"),
          newLink
        );
        hasChanges = true;
        console.log(`Fixed link in ${file}: ${oldLink} -> ${newLink}`);
      }
    }

    if (hasChanges) {
      await writeFile(file, content);
    }
  }
}

void fixLinks();
