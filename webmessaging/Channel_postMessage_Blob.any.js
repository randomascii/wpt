// META: title=postMessage() with a Blob

    var TARGET = null;
    var SOURCE = null;
    var description = "Messages can contain Blobs.";

    var t = async_test("Test Description: " + description);

    var channel = new MessageChannel();
    SOURCE = channel.port1;
    TARGET = channel.port2;
    TARGET.start();
    TARGET.addEventListener("message", t.step_func(TestMessageEvent), true);

    (function() {
      SOURCE.postMessage({blob: new Blob(['foo', 'bar'])});
    })();
    // TODO(https://github.com/web-platform-tests/wpt/issues/7899): Change to
    // some sort of cross-browser GC trigger.
    if (self.gc) self.gc();

    function TestMessageEvent(evt)
    {
        assert_true('blob' in evt.data);
        assert_true(evt.data.blob instanceof Blob);
        assert_equals(evt.data.blob.size, 6);
        const reader = new FileReader();
        reader.onerror = t.unreached_func('Reading blob failed');
        reader.onload = t.step_func(() => {
            assert_equals(reader.result, 'foobar');
            t.done();
          });
        reader.readAsText(evt.data.blob);
    }
