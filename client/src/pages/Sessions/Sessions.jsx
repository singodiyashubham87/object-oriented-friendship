import Loader from "@/components/Loader";
import { authAPI } from "@/services/api";
import { getErrorMessage } from "@/utils/common";
import dayjs from "dayjs";
import { get } from "lodash-es";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDialog from "@/components/ConfirmDialog";
import { UAParser } from "ua-parser-js";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: null,
  });

  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await authAPI.getSessions();
      const sessionsData = get(res, "data.data.sessions", []);
      setSessions(sessionsData);
    } catch (error) {
      toast.error(`Failed to load sessions: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleRevokeSession = (sessionId) => {
    setDialogConfig({
      isOpen: true,
      title: "Sign out device",
      message:
        "Are you sure you want to sign out this device? You will need to log in again on that device.",
      action: async () => {
        try {
          await authAPI.revokeSession(sessionId);
          toast.success("Session revoked successfully");
          setSessions(sessions.filter((s) => s.id !== sessionId));
        } catch (error) {
          toast.error(`Failed to revoke session: ${getErrorMessage(error)}`);
        } finally {
          setDialogConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleRevokeAllOther = () => {
    setDialogConfig({
      isOpen: true,
      title: "Logout all devices",
      message: "Are you sure you want to log out from all other devices?",
      action: async () => {
        try {
          await authAPI.revokeAllOtherSessions();
          toast.success("All other sessions revoked");
          fetchSessions();
        } catch (error) {
          toast.error(`Failed to revoke sessions: ${getErrorMessage(error)}`);
        } finally {
          setDialogConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  if (isLoading && sessions.length === 0) {
    return (
      <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto px-6 py-6 relative">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto px-3 sm:px-4 md:px-6 py-4 md:py-6 relative">
      <div className="flex justify-between items-center mb-6 w-full px-4 border-b border-primary-silver pb-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-primary-silver font-bold uppercase">
          Sessions
        </h2>
        {sessions.length > 0 && (
          <button
            type="button"
            onClick={handleRevokeAllOther}
            className="text-red-400 font-semibold border-2 border-red-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-custom-xs transition-colors hover:bg-red-900/40 text-sm sm:text-base hidden sm:block"
          >
            Logout all other devices
          </button>
        )}
      </div>

      <div className="w-full px-4 flex flex-col gap-4">
        {sessions.map((session) => {
          const parser = new UAParser(session.deviceInfo);
          const result = parser.getResult();
          const browserName = result.browser.name || "Unknown Browser";
          const osName = result.os.name || "Unknown OS";
          const deviceLabel =
            browserName !== "Unknown Browser" && osName !== "Unknown OS"
              ? `${browserName} on ${osName}`
              : session.deviceInfo || "Unknown Device";

          return (
            <div
              key={session.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-primary-silver-20 border border-primary-silver rounded-custom-s gap-4"
            >
              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <span className="text-primary-silver font-semibold text-lg break-all">
                    {deviceLabel}
                  </span>
                  {session.isCurrentDevice && (
                    <span className="bg-primary-silver/20 text-primary-silver text-xs px-2 py-1 rounded border border-primary-silver/30 font-semibold uppercase tracking-wider whitespace-nowrap">
                      This Device
                    </span>
                  )}
                </div>
                <span className="text-secondary-silver text-sm opacity-80">
                  IP: {session.ipAddress || "Unknown"}
                </span>
                <span className="text-secondary-silver text-sm opacity-80">
                  Started:{" "}
                  {dayjs(session.createdAt).format("MMM D, YYYY h:mm A")}
                </span>
              </div>
              {!session.isCurrentDevice && (
                <button
                  type="button"
                  onClick={() => handleRevokeSession(session.id)}
                  className="text-red-400 font-semibold border-2 border-red-400 hover:bg-red-900/40 px-3 py-1.5 rounded-custom-xs transition-colors self-end sm:self-auto whitespace-nowrap"
                >
                  Sign out
                </button>
              )}
            </div>
          );
        })}

        {sessions.length === 0 && (
          <div className="text-center text-secondary-silver mt-8 font-semibold w-full">
            No active sessions found.
          </div>
        )}

        {sessions.length > 0 && (
          <button
            type="button"
            onClick={handleRevokeAllOther}
            className="text-red-400 font-semibold border-2 border-red-400 px-3 py-2 mt-4 rounded-custom-xs transition-colors hover:bg-red-900/40 w-full sm:hidden text-center"
          >
            Logout all other devices
          </button>
        )}
      </div>

      <ConfirmDialog
        isOpen={dialogConfig.isOpen}
        title={dialogConfig.title}
        message={dialogConfig.message}
        onConfirm={() => dialogConfig.action?.()}
        onCancel={() => setDialogConfig((prev) => ({ ...prev, isOpen: false }))}
        confirmText="Confirm"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default Sessions;
