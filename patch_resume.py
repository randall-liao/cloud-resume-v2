import re

with open('packages/contracts/src/resume.ts', 'r') as f:
    content = f.read()

# 1. Add interface SideProject
interface_to_add = """
export interface ProjectMetrics {
  label: string;
  value: string;
}

export interface SideProject {
  title: string;
  icon: string;
  url: string;
  description: string;
  metrics: ProjectMetrics[];
  uptime?: string;
}
"""

content = re.sub(r'export interface OriginStorySection \{', interface_to_add + '\nexport interface OriginStorySection {', content)

# 2. Add sideProjects to ResumeDocument
content = re.sub(r'originStory: OriginStorySection;', 'originStory: OriginStorySection;\n  sideProjects: SideProject[];', content)


# 3. Add parsers
parser_to_add = """
function parseProjectMetrics(value: unknown, context: string): ProjectMetrics {
  const record = expectRecord(value, context);

  return {
    label: expectString(record.label, `${context}.label`),
    value: expectString(record.value, `${context}.value`),
  };
}

function parseSideProject(value: unknown, context: string): SideProject {
  const record = expectRecord(value, context);

  return {
    title: expectString(record.title, `${context}.title`),
    icon: expectString(record.icon, `${context}.icon`),
    url: expectString(record.url, `${context}.url`),
    description: expectString(record.description, `${context}.description`),
    metrics: expectObjectArray(record.metrics, `${context}.metrics`, parseProjectMetrics),
    uptime: record.uptime !== undefined ? expectString(record.uptime, `${context}.uptime`) : undefined,
  };
}
"""

content = re.sub(r'function parseOriginStorySection', parser_to_add + '\nfunction parseOriginStorySection', content)


# 4. Add to parseResumeDocument
content = re.sub(r'originStory: parseOriginStorySection\(record.originStory, \'resumeData.originStory\'\),', 'originStory: parseOriginStorySection(record.originStory, \'resumeData.originStory\'),\n    sideProjects: expectObjectArray(record.sideProjects, \'resumeData.sideProjects\', parseSideProject),', content)

with open('packages/contracts/src/resume.ts', 'w') as f:
    f.write(content)
