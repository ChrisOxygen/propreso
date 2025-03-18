import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiEdit, FiPlus } from "react-icons/fi";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProfileProjectsProps {
  projects: PrismaProject[];
  onEditProject: (id: string) => void;
}

export function ProfileProjects({
  projects,
  onEditProject,
}: ProfileProjectsProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Projects</h3>
        <Link href="/dashboard/add-project">
          <Button
            variant="outline"
            size="sm"
            className="border-black text-black hover:bg-gray-100"
          >
            <FiPlus size={16} className="mr-1" />
            Add Project
          </Button>
        </Link>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium mb-1">{project.title}</h4>
                    <p className="text-sm text-gray-700">
                      {project.description}
                    </p>

                    <div className="flex gap-4 mt-2">
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-black font-medium hover:underline"
                        >
                          Live Demo
                        </a>
                      )}
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-black font-medium hover:underline"
                        >
                          GitHub Repo
                        </a>
                      )}
                    </div>
                  </div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => onEditProject(project.id)}
                          className="text-gray-500 hover:text-black transition-colors"
                        >
                          <FiEdit size={18} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit project</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 mb-2">No projects added yet</p>
          <Link href="/dashboard/add-project">
            <Button
              variant="outline"
              size="sm"
              className="border-black text-black hover:bg-gray-100"
            >
              Add Your First Project
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
