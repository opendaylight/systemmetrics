::Make network between dockers and windows functioning. Add static route to windows
  route add 172.17.0.0/16 192.168.110.129

:: variables
:::::::::::::::::::::::::::::::::::::::::::::
:: find out IP address using "ifconfig" in VM
SET ip=192.168.110.129
:: path to "cluster-console-distribution" project folder
SET path=C:\work\projects\
:: path to script "configure-cluster-ipdetect.sh", plink.exe and pscp.exe
SET filesPath=C:\zmaz\
:::::::::::::::::::::::::::::::::::::::::::::

::Start dockers
  %filesPath%plink root@%ip% -l docker -pw docker123 docker start member-1 member-2 member-3

::Remove /opt/odl/ directory in each docker
  plink root@172.17.0.2 -pw docker123 "rm -r /opt/odl/"
  plink root@172.17.0.3 -pw docker123 "rm -r /opt/odl/"
  plink root@172.17.0.4 -pw docker123 "rm -r /opt/odl/"

::Create /opt/odl/ directory in each docker
  plink root@172.17.0.2 -pw docker123 "mkdir /opt/odl/"
  plink root@172.17.0.3 -pw docker123 "mkdir /opt/odl/"
  plink root@172.17.0.4 -pw docker123 "mkdir /opt/odl/"

::Copy distribution to all dockers
  %filesPath%pscp -pw docker123 %path%cluster-console-distribution\karaf\target\cluster-console-distribution-karaf-0.1.0-SNAPSHOT.zip root@172.17.0.2:/opt/odl/
  %filesPath%pscp -pw docker123 %path%cluster-console-distribution\karaf\target\cluster-console-distribution-karaf-0.1.0-SNAPSHOT.zip root@172.17.0.3:/opt/odl/
  %filesPath%pscp -pw docker123 %path%cluster-console-distribution\karaf\target\cluster-console-distribution-karaf-0.1.0-SNAPSHOT.zip root@172.17.0.4:/opt/odl/

::Unzip distribution in each docker
  %filesPath%plink root@172.17.0.2 -pw docker123 "cd /opt/odl && unzip -o cluster-console-distribution-karaf-0.1.0-SNAPSHOT.zip"
  %filesPath%plink root@172.17.0.3 -pw docker123 "cd /opt/odl && unzip -o cluster-console-distribution-karaf-0.1.0-SNAPSHOT.zip"
  %filesPath%plink root@172.17.0.4 -pw docker123 "cd /opt/odl && unzip -o cluster-console-distribution-karaf-0.1.0-SNAPSHOT.zip"

::Copy script "configure-cluster-ipdetect.sh" to unzipped distribution
  %filesPath%pscp -pw docker123 %filesPath%configure-cluster-ipdetect.sh root@172.17.0.2:/opt/odl/cluster-console-distribution-karaf-0.1.0-SNAPSHOT/
  %filesPath%pscp -pw docker123 %filesPath%configure-cluster-ipdetect.sh root@172.17.0.3:/opt/odl/cluster-console-distribution-karaf-0.1.0-SNAPSHOT/
  %filesPath%pscp -pw docker123 %filesPath%configure-cluster-ipdetect.sh root@172.17.0.4:/opt/odl/cluster-console-distribution-karaf-0.1.0-SNAPSHOT/

::set script as executable
  %filesPath%plink root@172.17.0.2 -pw docker123 "chmod +x /opt/odl/cluster-console-distribution-karaf-0.1.0-SNAPSHOT/configure-cluster-ipdetect.sh"
  %filesPath%plink root@172.17.0.3 -pw docker123 "chmod +x /opt/odl/cluster-console-distribution-karaf-0.1.0-SNAPSHOT/configure-cluster-ipdetect.sh"
  %filesPath%plink root@172.17.0.4 -pw docker123 "chmod +x /opt/odl/cluster-console-distribution-karaf-0.1.0-SNAPSHOT/configure-cluster-ipdetect.sh"

::and start script
  %filesPath%plink root@172.17.0.2 -pw docker123 "cd /opt/odl/cluster-console-distribution-karaf-0.1.0-SNAPSHOT/ &&./configure-cluster-ipdetect.sh 172.17.0.2 172.17.0.3 172.17.0.4"
  %filesPath%plink root@172.17.0.3 -pw docker123 "cd /opt/odl/cluster-console-distribution-karaf-0.1.0-SNAPSHOT/ &&./configure-cluster-ipdetect.sh 172.17.0.2 172.17.0.3 172.17.0.4"
  %filesPath%plink root@172.17.0.4 -pw docker123 "cd /opt/odl/cluster-console-distribution-karaf-0.1.0-SNAPSHOT/ &&./configure-cluster-ipdetect.sh 172.17.0.2 172.17.0.3 172.17.0.4"

::Finally run Karaf
  start %filesPath%plink root@172.17.0.2 -pw docker123 "cd /opt/odl/cluster-console-distribution-karaf-0.1.0-SNAPSHOT/ && ./bin/karaf"
  start %filesPath%plink root@172.17.0.3 -pw docker123 "cd /opt/odl/cluster-console-distribution-karaf-0.1.0-SNAPSHOT/ && ./bin/karaf"
  start %filesPath%plink root@172.17.0.4 -pw docker123 "cd /opt/odl/cluster-console-distribution-karaf-0.1.0-SNAPSHOT/ && ./bin/karaf"
