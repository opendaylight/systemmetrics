:: variables
:::::::::::::::::::::::::::::::::::::::::::::
:: path to "cluster-console-distribution" project folder
SET path=C:\work\projects\
:: path to script "configure-cluster-ipdetect.sh", plink.exe and pscp.exe
SET filesPath=C:\zmaz\
:::::::::::::::::::::::::::::::::::::::::::::

::Copy bundle
  %filesPath%pscp -pw docker123 %path%cluster-console\gui\gui-bundle\target\gui-bundle-0.1.0-SNAPSHOT.jar root@172.17.0.2:/opt/odl/cluster-console-distribution-karaf-0.1.0-SNAPSHOT/deploy
