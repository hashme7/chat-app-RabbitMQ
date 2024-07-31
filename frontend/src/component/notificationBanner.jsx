import React from 'react';
import { Transition } from '@headlessui/react'; 
import { XIcon } from '@heroicons/react/solid';


const NotificationBanner = ({ notifications,setNotifications }) => {
  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
      {notifications.map((notification, index) => (
        <Transition
          key={index}
          show={true}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="bg-gray-800 text-white p-4 rounded-md flex items-center space-x-4">
            <div>
              <strong>Notification:</strong> {notification.message}
            </div>
            <button
              className="ml-auto"
              onClick={() => {
                setNotifications((prevNotifications) =>
                  prevNotifications.filter((_, i) => i !== index)
                );
              }}
            >
              <XIcon className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </Transition>
      ))}
    </div>
  );
};

export default NotificationBanner;
