/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim:expandtab:shiftwidth=2:tabstop=2:
 */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef __nsGTKRemoteService_h__
#define __nsGTKRemoteService_h__

#include <gdk/gdk.h>
#include <gdk/gdkx.h>
#include <gtk/gtk.h>

#include "nsIRemoteService.h"
#include "nsXRemoteService.h"
#include "mozilla/Attributes.h"

class nsGTKRemoteService final : public nsIRemoteService,
                                 public nsXRemoteService {
 public:
  NS_DECL_ISUPPORTS
  NS_DECL_NSIREMOTESERVICE

  nsGTKRemoteService() : mServerWindow(nullptr) {}

  static gboolean HandlePropertyChange(GtkWidget* widget,
                                       GdkEventProperty* event, void* aData);

 private:
  ~nsGTKRemoteService() {}

  void HandleCommandsFor(GtkWidget* aWidget);

  GtkWidget* mServerWindow;
};

#endif  // __nsGTKRemoteService_h__
