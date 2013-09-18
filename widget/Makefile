WIDGET=iPeek
WIDGETDIR=diskimage/$(WIDGET).wdgt

all: ../ipeek/iPeek.dmg

../ipeek/iPeek.dmg: ../ipeek/gpeek.html Info.plist Default.png README
	@if test -d diskimage ; then rm -rf diskimage ; fi
	@mkdir diskimage
	@mkdir $(WIDGETDIR)
	@cp -p Info.plist Default.png ../ipeek/gpeek.html $(WIDGETDIR)
	@cp README diskimage
	cd diskimage && ../dmgpack.sh $(WIDGET) README $(WIDGET).wdgt
	@mv diskimage/$(WIDGET).dmg ../ipeek
	@rm -rf diskimage
