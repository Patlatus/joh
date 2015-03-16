Useful stickers - this is another modified version of web desktop providing to add stickers

# Obsolete version #
Obsolete original version is available here:
  * http://julfysoft.16mb.com/JOH/

# Version 0.0.0.1 #
Version 0.0.0.1 available here:
  * http://julfysoft.16mb.com/JOH_0001/

New release includes a few of bug fixes and new functionality implemented.
  * To show new sticker panel after add operation without page refresh.
  * To override default HTMLEditor component to make possible automatically add new hyperlink in new window `(with target="_blank" embedded part)` like you can do in livejournal.
  * To implement "Remove" button to remove sticker panels.
  * To implement "Edit" button to edit sticker panels: title, content and position.
  * To implement "Duplicate" button to duplicate existing sticker panel into a new one.

# Plans project #
I was rethinking about project applications, firstly I was thinking this can be useful for saving interesting bookmarks, but now I think this can be used also for noting down some plans, dreams or visions. Like making notes. I have added following stub functionalities
  * login functionality
  * logout functionality
  * signup (registration) functionality
  * having different notes for different users
  * started splitting user interface to separate Ukrainian and English configuration files
New project is available at link
  * http://julfysoft.16mb.com/plans/
P.S. Some original idea was about guessing user language - if it is Ukrainian or English and showing main user interface items in corresponding language.
For Internet Explorer it tries to use system language while for all other browsers it tries to use default language of browser.

## 8/5/2013 Update ##
  * Bug about absence of error notification about wrong credentials if you have mistyped password or username during login - Fixed.
  * Bug about not ability to logon if English wasn't indicated in settings.xml in list of supported languages - Fixed.

GUI improvement.
  * Now login form and signup (registration) form look like windows, user can drag them and they appear in the screen center (not in the top left corner as it was before).
  * Login form and registration form body color has been changed to light blue.
  * Wallpaper background added if user is not registered.

New features.
  * Implement "language" combobox on login form if user wants to choose different language than was automatically guessed from browser\system settings.
  * Implement "back" button on registration form if user doesn't want to register but wants to return to login form.
  * Indicate in console if user language is not present amongst supported languages list in settings.xml.
  * Indicate in console if supported languages list in settings.xml is empty.

Updated project is available at link
  * http://julfysoft.16mb.com/plans/

## 6 November 2013 Update ##
New branch **folders** created.
Many new features added.

Major updates
  * In new version default **stickers/addnote** module is hidden, only customization **hire me** visible.
  * Added new module **folders** which allows to browse content of predefined folder (music or progs in demo).
  * Request parameters implemented
  * guest=true login automatically as guest (without checking guest checkbox and clicking login button)
  * language=uk|en override language detection by given value
  * folder=`<path>` launch folders module and open given folder\file whenever applicable
Allowed values for path could be: **music** **progs** **music|2013** **music|2013|Detujeee.mp3**

New branch is available for testing on following mirrors:
  * http://patlatus.zz.mu/
  * http://julfysoft.tk/