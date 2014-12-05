
module = angular.module 'ngGallery'

module.service 'ngGalleryNav', ['$document', '$interval', ($document, $interval) ->

  @transitionDelay = 0 # delay next/prev transition
  @interval = null

  addDelay = (fn) ->
    if byInterval
      $timeout fn, @transitionDelay
    else
      fn


  @next = () =>
    _next = () => 
      # do something

    (addDelay _next)()


  @prev = () =>
    _prev = () =>
      # do something

    (addDelay _prev)()


  startAuto = (ms) =>
    # start auto play
    @interval = $interval (() => @next()), ms


  stopAuto = () =>
    if @interval?
      $interval.cancel interval

  @close = (dialog) =>
    # cleanInterval
    stopAuto()

    # view performCloseDialog source
    




  @bind = () =>
    if opts.timing > 0
      auto opts.timing

]