import os
import sys
import setup_lib

os.system('clear')
print()
print()
print("###################################")
print("##### RaspiWiFi Intial Setup  #####")
print("###################################")
print()
print()
entered_ssid = input("Would you like to specify an SSID you'd like to use for Host/Configuration mode? [default: RaspiWiFi Setup]: ")
auto_config_choice = input("Would you like to enable auto-reconfiguration mode (y/n)? [default: n]: ")
auto_config_delay = input("How long of a delay would you like without an active connection before auto-reconfiguration triggers (seconds)? [default: 300]: ")
os.system('clear')
print()
print()
install_ans = input("Would you like to continue with the final installation at this point (This can take up to 5 minutes)? (y/n): ")

if(install_ans == 'y'):
	setup_lib.install_prereqs()
	setup_lib.copy_configs()
	setup_lib.update_main_config_file(entered_ssid, auto_config_choice, auto_config_delay)
	setup_lib.post_install_procs()

else:
	print()
	print()
	print("===================================================")
	print("---------------------------------------------------")
	print()
	print("RaspiWiFi installation cancelled. Nothing changed...")
	print()
	print("---------------------------------------------------")
	print("===================================================")
	print()
	print()
	sys.exit()

os.system('clear')
print()
print()
print("#####################################")
print("##### RaspiWiFi Setup Complete  #####")
print("#####################################")
print()
print()
print("Initial setup is complete. A reboot is required to start in WiFi configuration mode...")
reboot_ans = input("Would you like to do that now? (y/n): ")

if reboot_ans == 'y':
	os.system('reboot')
